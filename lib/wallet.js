'use client';
import { createWalletClient, createPublicClient, custom, http } from 'viem';
import { CHAIN, USDC, CHECKOUT, CHECKOUT_ABI, ERC20_ABI } from '../lib/chain';

/**
 * Wallet access. Order of preference:
 *  1. EIP-6963 announced providers (MetaMask, Rabby, Rainbow, Brave, ... — any extension)
 *  2. window.ethereum (legacy injection)
 *  3. WalletConnect (any mobile/desktop wallet via QR or deep link) when NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is set
 * No vendor lock-in and no custody: the user's wallet signs, we never hold keys.
 */
const WC_PROJECT = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
let wcProvider = null;

function discoverInjected() {
  return new Promise((resolve) => {
    const found = [];
    const onAnnounce = (e) => { if (e?.detail?.provider) found.push(e.detail); };
    window.addEventListener('eip6963:announceProvider', onAnnounce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', onAnnounce);
      // Prefer a non-Coinbase announced provider if several exist; otherwise anything injected.
      const pick = found.find(d => !/coinbase/i.test(d.info?.name ?? '')) ?? found[0];
      resolve(pick?.provider ?? window.ethereum ?? null);
    }, 120);
  });
}

async function walletConnectProvider() {
  if (!WC_PROJECT) return null;
  if (wcProvider) return wcProvider;
  const { EthereumProvider } = await import('@walletconnect/ethereum-provider');
  wcProvider = await EthereumProvider.init({
    projectId: WC_PROJECT, chains: [CHAIN.id], showQrModal: true,
    rpcMap: { [CHAIN.id]: CHAIN.rpcUrls.default.http[0] },
    metadata: { name: 'FyreCore', description: 'FyreCore games — USDC on Base', url: 'https://www.fyrecore.app', icons: ['https://www.fyrecore.app/icon.png'] }
  });
  return wcProvider;
}

/** True when WalletConnect is configured on this deployment. */
export const hasWalletConnect = () => !!WC_PROJECT;

/**
 * Returns an EIP-1193 provider or throws with a human message.
 * method: 'injected' | 'walletconnect' | undefined (auto: injected, else WalletConnect).
 */
export async function getProvider(method) {
  if (typeof window === 'undefined') throw new Error('no window');
  if (method === 'walletconnect') {
    const wc = await walletConnectProvider();
    if (!wc) throw new Error('WalletConnect is not enabled on this deployment.');
    if (!wc.session) await wc.connect();
    return wc;
  }
  const injected = await discoverInjected();
  if (injected) return injected;
  if (method === 'injected') throw new Error('No browser wallet found. Install MetaMask or Rabby, or use WalletConnect.');
  const wc = await walletConnectProvider();
  if (wc) { if (!wc.session) await wc.connect(); return wc; }
  throw new Error('No wallet found. Install MetaMask or Rabby, or open this page inside your wallet app.');
}

async function ensureChain(eth) {
  const hexId = '0x' + CHAIN.id.toString(16);
  const cur = await eth.request({ method: 'eth_chainId' });
  if (cur === hexId) return;
  try { await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexId }] }); }
  catch { await eth.request({ method: 'wallet_addEthereumChain', params: [{ chainId: hexId, chainName: CHAIN.name, nativeCurrency: CHAIN.nativeCurrency, rpcUrls: [CHAIN.rpcUrls.default.http[0]], blockExplorerUrls: [CHAIN.blockExplorers?.default?.url] }] }); }
}

/** Connect and return { eth, address }. */
export async function connectWallet(method) {
  const eth = await getProvider(method);
  const [address] = await eth.request({ method: 'eth_requestAccounts' });
  return { eth, address };
}

/** Link the connected wallet to the signed-in Core: sign a server nonce, no transaction. */
export async function linkWallet({ onStatus, method }) {
  onStatus?.(method === 'walletconnect' ? 'Scan the code with your wallet app' : 'Connecting wallet');
  const { eth, address } = await connectWallet(method);
  const n = await fetch('/api/wallet/nonce', { method: 'POST' }); const nd = await n.json();
  if (!n.ok) throw new Error(nd.error ?? 'could not start');
  onStatus?.('Sign the message in your wallet (free, no transaction)');
  const sig = await eth.request({ method: 'personal_sign', params: [nd.message, address] });
  const r = await fetch('/api/wallet/link', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ address, signature: sig }) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error ?? 'link failed');
  return d.wallet;
}

/**
 * Pay a signed quote with USDC. connect -> ensure chain -> approve if needed -> pay -> return tx hash.
 * onStatus(text) reports progress to the UI.
 */
export async function payWithUsdc({ quoteFor, onStatus, method }) {
  onStatus?.(method === 'walletconnect' ? 'Scan the code with your wallet app' : 'Connecting wallet');
  const { eth, address: buyer } = await connectWallet(method);
  await ensureChain(eth);

  onStatus?.('Getting a signed quote');
  const q = await quoteFor(buyer);            // caller hits /api/checkout/quote with the buyer address
  const v = q.voucher; const amount = BigInt(v.amount);

  const wallet = createWalletClient({ chain: CHAIN, transport: custom(eth), account: buyer });
  const pub = createPublicClient({ chain: CHAIN, transport: http() });

  const bal = await pub.readContract({ address: USDC, abi: ERC20_ABI, functionName: 'balanceOf', args: [buyer] });
  if (bal < amount) throw new Error(`Not enough USDC on ${CHAIN.name}: need ${(Number(amount) / 1e6).toFixed(2)}, have ${(Number(bal) / 1e6).toFixed(2)}`);

  const allowance = await pub.readContract({ address: USDC, abi: ERC20_ABI, functionName: 'allowance', args: [buyer, CHECKOUT] });
  if (allowance < amount) {
    onStatus?.('Approve USDC in your wallet');
    const ah = await wallet.writeContract({ address: USDC, abi: ERC20_ABI, functionName: 'approve', args: [CHECKOUT, amount] });
    await pub.waitForTransactionReceipt({ hash: ah });
  }

  onStatus?.('Confirm the purchase in your wallet');
  const hash = await wallet.writeContract({
    address: CHECKOUT, abi: CHECKOUT_ABI, functionName: 'pay',
    args: [v.orderId, v.token, amount, BigInt(v.priceUsdCents), v.skuId, v.qty, BigInt(v.deadline), v.sig]
  });
  onStatus?.('Waiting for confirmation');
  await pub.waitForTransactionReceipt({ hash });
  return { hash, orderDbId: q.orderDbId, openingId: q.openingId };
}

/**
 * Sign in (or sign up) with a wallet: EIP-4361 message signed by the wallet, verified by Supabase Auth.
 * The wallet address is the identity; no email involved. Works with extensions and WalletConnect.
 */
export async function signInWithWallet({ supabase, method, onStatus }) {
  const { getAddress } = await import('viem');
  onStatus?.(method === 'walletconnect' ? 'Scan the code with your wallet app' : 'Connecting wallet');
  const { eth, address } = await connectWallet(method);
  const checksummed = getAddress(address);
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, '0')).join('');
  const message = [
    `${window.location.host} wants you to sign in with your Ethereum account:`,
    checksummed, '',
    'Sign in to FyreCore. This is free and sends no transaction. I accept the Terms at https://www.fyrecore.app/legal', '',
    `URI: ${window.location.origin}/join`,
    'Version: 1',
    `Chain ID: ${CHAIN.id}`,
    `Nonce: ${nonce}`,
    `Issued At: ${new Date().toISOString()}`
  ].join('\n');
  onStatus?.('Confirm the sign-in in your wallet (free, no transaction)');
  const signature = await eth.request({ method: 'personal_sign', params: [message, address] });
  const { data, error } = await supabase.auth.signInWithWeb3({ chain: 'ethereum', message, signature });
  if (error) throw new Error(error.message);
  const r = await fetch('/api/auth/ensure', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wallet: checksummed, method: method === 'walletconnect' ? 'walletconnect' : 'wallet' }) });
  if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error ?? 'could not create your Core'); }
  return data;
}
