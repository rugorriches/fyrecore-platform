'use client';
import { useState } from 'react';
import { payWithUsdc } from '../lib/wallet';

/**
 * One-click USDC purchase for a fixed-contents SKU (cosmetic, pass, pack, perk).
 * Quote -> wallet pay -> on-chain confirm -> entitlement. No card path exists.
 */
export default function BuyUsdc({ skuId, priceUsdCents, label = 'Buy with USDC', soldOut = false, compact = false }) {
  const [status, setStatus] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function go() {
    if (busy || done || soldOut) return;
    setBusy(true);
    try {
      const r = await payWithUsdc({
        onStatus: setStatus,
        quoteFor: async (buyer) => {
          const q = await fetch('/api/checkout/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ skuId, buyer, qty: 1 }) });
          const d = await q.json();
          if (q.status === 401) { window.location.href = '/join'; throw new Error('Sign in first'); }
          if (!q.ok) throw new Error(d.error ?? 'quote failed');
          return d;
        }
      });
      if (!r) return;                                 // handed off to a mobile wallet browser
      setStatus('Confirming on-chain');
      const c = await fetch('/api/checkout/confirm', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ txHash: r.hash, orderDbId: r.orderDbId }) });
      const cd = await c.json();
      if (!c.ok) throw new Error(cd.error ?? 'confirm failed');
      setDone(true); setStatus('Yours. It is in your Core.');
    } catch (e) { setStatus(e.message); }
    finally { setBusy(false); }
  }

  const price = `$${(priceUsdCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  return (
    <div className="buy">
      <button className={`btn ${done ? 'btn--ghost' : 'btn--heat'}`} onClick={go} disabled={busy || done || soldOut} style={{cursor: busy || done || soldOut ? 'default' : 'pointer', border:'none', width: compact ? 'auto' : '100%', justifyContent:'center'}}>
        {soldOut ? 'Sold out' : done ? 'Owned' : busy ? 'Working…' : `${label} · ${price}`}
      </button>
      {status && <small className="buy__status">{status}</small>}
    </div>
  );
}
