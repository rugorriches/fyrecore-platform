'use client';
import { useState } from 'react';
import { linkWallet, hasWalletConnect } from '../lib/wallet';

/** Link (or re-link) the wallet that prize money and redemptions are paid to. Signature only, no gas. */
export default function LinkWallet({ current }) {
  const [wallet, setWallet] = useState(current ?? null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const wc = hasWalletConnect();

  async function go(method) {
    setBusy(true); setStatus(null);
    try { const w = await linkWallet({ onStatus: setStatus, method }); setWallet(w); setStatus('Linked.'); }
    catch (e) { setStatus(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="buy">
      {wallet && <p style={{fontFamily:'monospace', fontSize:'.85rem', wordBreak:'break-all', margin:'0 0 .6rem'}}>{wallet}</p>}
      <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap'}}>
        <button className={`btn ${wallet ? 'btn--ghost' : 'btn--heat'}`} onClick={() => go('injected')} disabled={busy} style={{cursor: busy ? 'default' : 'pointer', border:'none'}}>
          {busy ? 'Working…' : wallet ? 'Re-link: browser wallet' : 'Browser wallet'}
        </button>
        {wc && (
          <button className="btn btn--ghost" onClick={() => go('walletconnect')} disabled={busy} style={{cursor: busy ? 'default' : 'pointer'}}>
            {wallet ? 'Re-link: WalletConnect' : 'WalletConnect'}
          </button>
        )}
      </div>
      <small style={{display:'block', color:'var(--steel)', fontSize:'.78rem', marginTop:'.5rem'}}>Browser wallet = MetaMask, Rabby or any extension. WalletConnect = scan a code with the wallet app on your phone.</small>
      {status && <small className="buy__status">{status}</small>}
    </div>
  );
}
