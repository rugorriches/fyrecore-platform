'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
const Box3D = dynamic(() => import('./Box3D'), { ssr: false });
import { payWithUsdc } from '../lib/wallet';

const RCOL = { common:'#7A8299', uncommon:'#3FE0A8', rare:'#4E8BFF', epic:'#A46BFF', legendary:'#FFC24A', mythic:'#FF4423', relic:'#EDE6DC' };
const RDUR = { common:800, uncommon:900, rare:1100, epic:1600, legendary:2200, mythic:3000, relic:3400 };

export default function BoxStore({ boxes, rarities, openingFromUrl }) {
  const [sel, setSel] = useState(boxes[0] ?? null);
  const [phase, setPhase] = useState('idle');       // idle | charge | crack | open
  const [charge, setCharge] = useState(0);
  const [status, setStatus] = useState(null);       // text under the box
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState([]);
  const holdRef = useRef(null);

  // Returning with ?opening=ID (paid on-chain, not yet opened — e.g. after a mobile wallet round-trip) -> open it
  useEffect(() => { if (openingFromUrl) { const b = boxes.find(x => x.id === openingFromUrl.boxId) ?? sel; if (b) setSel(b); openNow(openingFromUrl.id); } }, [openingFromUrl]); // eslint-disable-line

  async function buyUsdc() {
    try {
      const clientSeed = crypto.getRandomValues(new Uint32Array(4)).join('-');
      const r = await payWithUsdc({
        onStatus: setStatus,
        quoteFor: async (buyer) => {
          const q = await fetch('/api/checkout/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ boxId: sel.id, buyer, clientSeed }) });
          const d = await q.json();
          if (!q.ok) { if (d.needsVerification) window.location.href = '/verify'; throw new Error(d.error ?? 'quote failed'); }
          return d;
        }
      });
      if (!r) return;                                   // handed off to a mobile wallet browser
      setStatus('Confirming on-chain');
      const c = await fetch('/api/checkout/confirm', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ txHash: r.hash, orderDbId: r.orderDbId }) });
      const cd = await c.json();
      if (!c.ok) throw new Error(cd.error ?? 'confirm failed');
      await openNow(r.openingId);
    } catch (e) { setStatus(e.message); setPhase('idle'); }
  }

  async function openNow(openingId) {
    setResult(null); setRevealed([]); setPhase('idle'); setStatus('Hold to open');
    // ritual: hold for 2s
    await new Promise(res => { let c = 0; setPhase('charge'); const id = setInterval(() => { c = Math.min(1, c + 0.05); setCharge(c); if (c >= 1) { clearInterval(id); res(); } }, 100); });
    setPhase('crack');
    const r = await fetch('/api/boxes/open', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ openingId }) });
    const d = await r.json();
    if (!r.ok) { setPhase('idle'); setStatus(d.state === 'none' || d.error === 'not paid' ? 'Payment has not cleared yet. Give it a few seconds and refresh.' : (d.error ?? 'Open failed')); return; }
    setPhase('open'); setResult(d); setStatus(null);
    // auto-reveal left to right, highest last (server already sorted)
    for (let i = 0; i < d.results.length; i++) { await new Promise(res => setTimeout(res, i === 0 ? 900 : RDUR[d.results[i - 1].rarity] ?? 900)); setRevealed(v => [...v, i]); }
  }

  const odds = useMemo(() => sel ? sel.odds.filter(o => o.pct > 0) : [], [sel]);

  return (
    <div className="bx">
      <div className="bx__stage" style={{'--bx': sel?.color ?? '#FF4423', '--bxg': sel?.glow ?? 'rgba(255,68,35,.8)'}}>
        <Box3D color={sel?.color} glow={sel?.glow} phase={phase} charge={charge} height={380} />
        <div className="bx__name"><span className="eyebrow" style={{color:'var(--bx)'}}>{sel?.name}</span><b>${((sel?.price_usd_cents ?? 0) / 100).toLocaleString()}</b></div>
        {status && <p className="bx__status">{status}</p>}
        {!result && phase === 'idle' && sel && (
          <div className="hero__acts" style={{justifyContent:'center', flexDirection:'column', alignItems:'center', gap:'.5rem'}}>
            <button className="btn btn--heat" onClick={buyUsdc} style={{cursor:'pointer',border:'none'}}>Pay with USDC on Base</button>
            <small style={{color:'var(--steel)', fontSize:'.78rem'}}>MetaMask, Rabby, or any WalletConnect wallet. Price is exact, no markup. <a href="/faq#usdc">How to get USDC on Base</a></small>
          </div>
        )}
        {result && (
          <>
            <div className="cards">
              {result.results.map((d, i) => {
                const on = revealed.includes(i); const c = RCOL[d.rarity];
                return (
                  <div key={i} className={`card${on ? ' card--on' : ''} card--${d.rarity}`} style={{'--rc': c, animationDelay: `${i * 0.12}s`}} onClick={() => setRevealed(v => v.includes(i) ? v : [...v, i])}>
                    <div className="card__back" />
                    <div className="card__face">
                      <span className="card__rar" style={{color: c}}>{d.rarity}</span>
                      <b>{d.name ?? 'Unnamed'}</b>
                      {d.duplicate && <em>Duplicate → +{d.embers} Embers</em>}
                      <small>Bound to your Core</small>
                    </div>
                  </div>
                );
              })}
            </div>
            {revealed.length === result.results.length && (
              <div className="bx__after">
                <p className="bx__pity">Pity: {result.pity.sincePity} / {result.pity.pityAfter} until a guaranteed {result.pity.pityRarity}.{result.embersFromDupes > 0 ? ` +${result.embersFromDupes} Embers from duplicates.` : ''}</p>
                <div className="hero__acts" style={{justifyContent:'center',marginTop:'.6rem'}}>
                  <button className="btn btn--heat" onClick={() => { setResult(null); setRevealed([]); setPhase('idle'); setStatus(null); }} style={{cursor:'pointer',border:'none'}}>Open another</button>
                  <a className="btn btn--ghost" href="/core">Inventory</a>
                </div>
                <details className="bx__fair"><summary>Verify this opening</summary>
                  <code>server seed hash: {result.serverSeedHash}</code>
                  <code>server seed: {result.serverSeed}</code>
                  <code>client seed: {result.clientSeed} · nonce: {result.nonce}</code>
                  <p>sha256(server seed) must equal the hash you were shown before paying. Each roll is the first 4 bytes of HMAC-SHA256(server seed, clientSeed:nonce:i) divided by 2³², walked across the published odds.</p>
                </details>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bx__pick">
        {boxes.map(b => (
          <button key={b.id} className={`bxpick${sel?.id === b.id ? ' bxpick--on' : ''}`} style={{'--bx': b.color, '--bxg': b.glow}} onClick={() => { if (!result) { setSel(b); setStatus(null); } }}>
            <i /><span>{b.name}</span><b>${(b.price_usd_cents / 100).toLocaleString()}</b>
          </button>
        ))}
      </div>

      {sel && (
        <div className="bx__odds">
          <div className="head" style={{marginBottom:'1.2rem'}}><h2 style={{fontSize:'var(--s2)'}}>{sel.name} — published odds</h2>
            <p style={{fontSize:'var(--s-1)'}}>{sel.drops_per_box} drops. {sel.guaranteed_min_rarity_drops} guaranteed above {sel.min_rarity}. Guaranteed {sel.pity_rarity} within {sel.pity_after} boxes.</p></div>
          <div className="oddsbar">{odds.map(o => <i key={o.rarity} style={{flex:o.pct, background:RCOL[o.rarity]}} title={`${o.rarity} ${o.pct}%`} />)}</div>
          <ul className="chips">{odds.map(o => <li key={o.rarity} style={{borderColor:RCOL[o.rarity], color:RCOL[o.rarity]}}>{o.rarity} {o.pct}% · {sel.pool[o.rarity] ?? 0} items</li>)}</ul>
        </div>
      )}
    </div>
  );
}