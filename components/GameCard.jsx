import Link from 'next/link';
import { CURRENCY, STATUS } from '../lib/data';

export default function GameCard({ g, i = 0 }) {
  const omen = g.section === 'omen';
  const inner = (
    <>
      <div className="gcard__glow" aria-hidden="true" />
      <div className="gcard__body">
        <div className="gcard__top">
          <span className={`tag ${omen ? 'tag--omen' : 'tag--fc'}`}>{omen ? 'OMEN platform' : 'FyreCore'}</span>
          <span className="gcard__status">{STATUS[g.status] ?? g.status}{g.placement==='tentative' ? ' · placement TBD' : ''}</span>
        </div>
        <h3>{g.name}</h3>
        <p className="gcard__genre">{g.genre}{g.engine ? ` · ${g.engine}` : ''}</p>
        {g.tagline && <p className="gcard__tag">{g.tagline}</p>}
        <ul className="chips chips--tight">
          {(g.accepted_currencies ?? []).map(c => <li key={c}>{CURRENCY[c]?.label ?? c}</li>)}
          {g.lane === 'both' && <li>Certified lane</li>}
        </ul>
        <span className="gcard__cta">{g.play_url ? 'Play' : 'Details'}<i aria-hidden="true">&rarr;</i></span>
      </div>
    </>
  );
  const cls = `gcard reveal${omen ? ' gcard--omen' : ''}`;
  return g.play_url
    ? <a className={cls} href={g.play_url} target="_blank" rel="noopener" style={{'--i': i}}>{inner}</a>
    : <div className={cls} style={{'--i': i}}>{inner}</div>;
}