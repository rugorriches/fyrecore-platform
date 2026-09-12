import Link from 'next/link';
import { CURRENCY, STATUS } from '../lib/data';

/**
 * Game card. Released titles: the whole card is a link to the FyreCore detail page, with a
 * separate Play button that goes straight to the game. Previews render as a card only — no links.
 */
export default function GameCard({ g, i = 0 }) {
  const omen = g.section === 'omen';
  const live = !g.preview;
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
          ? <span className="gcard__cta">Details<i aria-hidden="true">&rarr;</i></span>
          : <span className="gcard__cta gcard__cta--soon">In development</span>}
      </div>
      {live && g.play_url && (
        <a className="gcard__play" href={g.play_url} target="_blank" rel="noopener" aria-label={`Play ${g.name}`}>
          <span className="gcard__playglyph" aria-hidden="true">&#9654;</span>Play now
        </a>
      )}
    </>
  );
  const cls = `gcard reveal${omen ? ' gcard--omen' : ''}${g.preview ? ' gcard--preview' : ''}`;
  return live
    ? <div className={cls} style={{'--i': i}}><Link href={`/games/${g.slug}`} className="gcard__hit" aria-label={g.name} />{inner}</div>
    : <div className={cls} style={{'--i': i}}>{inner}</div>;
}
