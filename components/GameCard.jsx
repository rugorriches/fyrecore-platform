import { CURRENCY, STATUS } from '../lib/data';

/**
 * Game card. A title marked `preview` renders as a card only: no link, no play URL, no details CTA.
 * Art falls back to the lettered plate when a game has no key art yet.
 */
export default function GameCard({ g, i = 0 }) {
  const omen = g.section === 'omen';
  const live = !g.preview && g.play_url;
  const inner = (
    <>
      <div className="gcard__art" aria-hidden="true">
        {g.art_url
          ? <img src={g.art_url} alt="" loading="lazy" />
          : <span className="gcard__plate">{g.name.replace(/^OMEN:\s*/, '').slice(0, 1)}</span>}
        <div className="gcard__scrim" />
      </div>
      <div className="gcard__glow" aria-hidden="true" />
      <div className="gcard__body">
        <div className="gcard__top">
          <span className={`tag ${omen ? 'tag--omen' : 'tag--fc'}`}>{omen ? 'OMEN platform' : 'FyreCore'}</span>
          <span className="gcard__status">{g.preview ? 'Preview' : (STATUS[g.status] ?? g.status)}{g.placement === 'tentative' ? ' · placement TBD' : ''}</span>
        </div>
        <h3>{g.name}</h3>
        <p className="gcard__genre">{g.genre}{g.engine ? ` · ${g.engine}` : ''}</p>
        {(g.description || g.tagline) && <p className="gcard__tag">{g.description ?? g.tagline}</p>}
        <ul className="chips chips--tight">
          {(g.accepted_currencies ?? []).map(c => <li key={c}>{CURRENCY[c]?.label ?? c}</li>)}
          {g.lane === 'both' && <li>Certified lane</li>}
        </ul>
        {live
          ? <span className="gcard__cta">Play<i aria-hidden="true">&rarr;</i></span>
          : <span className="gcard__cta gcard__cta--soon">{g.preview ? 'In development' : 'Details'}</span>}
      </div>
    </>
  );
  const cls = `gcard reveal${omen ? ' gcard--omen' : ''}${g.preview ? ' gcard--preview' : ''}`;
  return live
    ? <a className={cls} href={g.play_url} target="_blank" rel="noopener" style={{'--i': i}}>{inner}</a>
    : <div className={cls} style={{'--i': i}}>{inner}</div>;
}
