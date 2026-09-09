'use client';
import { createWalletClient, createPublicClient, custom, http } from 'viem';
import { CHAIN, USDC, CHECKOUT, CHECKOUT_ABI, ERC20_ABI } from '../lib/chain';

/**
 * Pay a signed quote with USDC from an injected wallet (Coinbase Wallet, MetaMask, Rabby).
 * Steps: connect -> ensure chain -> approve if needed -> pay -> return tx hash.
 * onStatus(text) reports progress to the UI.
 */
export async function payWithUsdc({ quoteFor, onStatus }) {
  const eth = typeof window !== 'undefined' ? window.ethereum : null;
  if (!eth) {
    // No injected provider. On mobile, hand the page to Coinbase Wallet's in-app browser; on desktop, explain.
    const mobile = /android|iphone|ipad/i.test(navigator.userAgent);
    if (mobile) { window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`; return; }
    throw new Error('No wallet found. Install Coinbase Wallet or MetaMask and fund it with USDC on Base.');
  }

  onStatus?.('Connecting wallet');
  const [buyer] = await eth.request({ method: 'eth_requestAccounts' });
  const hexId = '0x' + CHAIN.id.toString(16);
  const cur = await eth.request({ method: 'eth_chainId' });
  if (cur !== hexId) {
    try { await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexId }] }); }
    catch { await eth.request({ method: 'wallet_addEthereumChain', params: [{ chainId: hexId, chainName: CHAIN.name, nativeCurrency: CHAIN.nativeCurrency, rpcUrls: [CHAIN.rpcUrls.default.http[0]], blockExplorerUrls: [CHAIN.blockExplorers?.default?.url] }] }); }
  }

  onStatus?.('Getting a signed quote');
  const q = await quoteFor(buyer);            // caller hits /api/checkout/quote with the buyer address
  const v = q.voucher; const amount = BigInt(v.amount);

  const wallet = createWalletClient({ chain: CHAIN, transport: custom(eth), account: buyer });
  const pub = createPublicClient({ chain: CHAIN, transport: http() });

  const bal = await pub.readContract({ address: USDC, abi: ERC20_ABI, functionName: 'balanceOf', args: [buyer] });
  if (bal < amount) throw new Error(`Not enough USDC: need ${(Number(amount) / 1e6).toFixed(2)}, have ${(Number(bal) / 1e6).toFixed(2)}`);

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