import { STATUS } from '../lib/data';

export default function CollectionCard({ c, i = 0 }) {
  const omen = c.tier === 'omen';
  const pct = c.supply_cap ? Math.min(100, Math.round((c.minted / c.supply_cap) * 100)) : null;
  return (
    <article className={`ncard reveal${omen ? ' ncard--omen' : ''}`} style={{'--i': i}}>
      <div className="ncard__art" aria-hidden="true"><span>{c.name.slice(0,1)}</span></div>
      <div className="ncard__body">
        <div className="gcard__top">
          <span className={`tag ${omen ? 'tag--omen' : 'tag--fc'}`}>{omen ? 'OMEN contracts · BSC' : 'FyreCore contracts · Base'}</span>
          <span className="gcard__status">{STATUS[c.status] ?? c.status}</span>
        </div>
        <h3>{c.name}</h3>
        <p>{c.description}</p>
        <ul className="chips chips--tight">{(c.perks ?? []).map(p => <li key={p}>{p}</li>)}</ul>
        <div className="ncard__meta">
          <span>{c.kind}</span>
          <span>{c.supply_cap ? `${c.minted.toLocaleString()} / ${c.supply_cap.toLocaleString()}` : 'Supply set by OMEN'}</span>
        </div>
        {pct != null && <div className="bar bar--thin"><i style={{animation:'none',transform:`scaleX(${pct/100})`}} /></div>}
        <p className="ncard__rule">
          {omen
            ? 'Minted into OMEN contracts. Priced and traded in OMENX and GMT under OMEN rules. FyreCore does not own this contract.'
            : 'Minted on FyreCore contracts. Priced in USD; pay by card, USDC, OMENX or GMT. Cosmetic and access only — no yield.'}
        </p>
      </div>
    </article>
  );
}