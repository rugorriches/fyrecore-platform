'use client';
import { useState } from 'react';
import { linkWallet } from '../lib/wallet';

/** Link (or re-link) the wallet that prize money and redemptions are paid to. Signature only, no gas. */
export default function LinkWallet({ current }) {
  const [wallet, setWallet] = useState(current ?? null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try { const w = await linkWallet({ onStatus: setStatus }); setWallet(w); setStatus('Linked.'); }
    catch (e) { setStatus(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="buy">
      {wallet && <p style={{fontFamily:'monospace', fontSize:'.85rem', wordBreak:'break-all', margin:'0 0 .6rem'}}>{wallet}</p>}
      <button className={`btn ${wallet ? 'btn--ghost' : 'btn--heat'}`} onClick={go} disabled={busy} style={{cursor: busy ? 'default' : 'pointer', border:'none'}}>
        {busy ? 'Working…' : wallet ? 'Link a different wallet' : 'Link a wallet'}
      </button>
      {status && <small className="buy__status">{status}</small>}
    </div>
  );
}
