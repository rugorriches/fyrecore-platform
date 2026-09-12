import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { CURRENCY, STATUS } from '../../../lib/data';

export const revalidate = 300;

async function getGame(slug) {
  if (!isSupabaseConfigured()) return null;
  const { data } = await createClient().from('games').select('*').eq('slug', slug).maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const g = await getGame(params.slug);
  if (!g) return { title: 'Game' };
  return { title: g.name, description: g.tagline ?? undefined, openGraph: g.art_url ? { images: [g.art_url] } : undefined };
}

export default async function GamePage({ params }) {
  const g = await getGame(params.slug);
  if (!g || g.preview) notFound();          // previews have no detail page
  const omen = g.section === 'omen';
  const modes = Array.isArray(g.modes) ? g.modes : [];

  return (
    <article className="gpage">
      <header className="gpage__hero">
        {g.art_url && <img className="gpage__art" src={g.art_url} alt="" />}
        <div className="gpage__scrim" />
        <div className="wrap gpage__head">
          <Link href={omen ? '/omen' : '/games'} className="gpage__back">&larr; {omen ? 'OMEN games' : 'FyreCore games'}</Link>
          <span className={`tag ${omen ? 'tag--omen' : 'tag--fc'}`}>{omen ? 'OMEN platform' : 'FyreCore'}</span>
          <h1>{g.name}</h1>
          <p className="gpage__genre">{g.genre}{g.engine ? ` · ${g.engine}` : ''} · {STATUS[g.status] ?? g.status}</p>
          {g.play_url && <a className="btn btn--heat gpage__play" href={g.play_url} target="_blank" rel="noopener">Play now<i aria-hidden="true">&rarr;</i></a>}
        </div>
      </header>

      <section className="section"><div className="wrap gpage__grid">
        <div className="gpage__main">
          <h2 className="gpage__h2">About</h2>
          <p className="gpage__lede">{g.tagline}</p>
          <p>{g.description}</p>

          {modes.length > 0 && (<>
            <h2 className="gpage__h2">Modes</h2>
            <div className="gpage__modes">
              {modes.map(m => (
                <div className="gpage__mode" key={m.name}>
                  <div className="gpage__modetop"><b>{m.name}</b><span>{m.cost}</span></div>
                  <p>{m.detail}</p>
                </div>
              ))}
            </div>
          </>)}

          {g.disclaimer && <div className="note note--warn gpage__disc"><p>{g.disclaimer}</p></div>}
        </div>

        <aside className="gpage__side">
          <div className="acct">
            <h3 className="gpage__h3">Status</h3>
            <p className="gpage__status">{STATUS[g.status] ?? g.status}</p>
            {(g.platforms ?? []).length > 0 && (<>
              <h3 className="gpage__h3">Platforms</h3>
              <ul className="chips chips--tight">{g.platforms.map(p => <li key={p}>{p}</li>)}</ul>
            </>)}
            <h3 className="gpage__h3">Currency</h3>
            <ul className="chips chips--tight">
              {(g.accepted_currencies ?? []).map(c => <li key={c}>{CURRENCY[c]?.label ?? c}</li>)}
            </ul>
            {g.play_url && <a className="btn btn--heat" href={g.play_url} target="_blank" rel="noopener" style={{marginTop:'1.2rem',width:'100%',justifyContent:'center',border:'none'}}>Play now</a>}
          </div>
          {(g.tags ?? []).length > 0 && (
            <div className="acct" style={{marginTop:'1rem'}}>
              <h3 className="gpage__h3" style={{marginTop:0}}>Tags</h3>
              <ul className="chips chips--tight gpage__tags">{g.tags.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
          )}
          {omen && (
            <div className="note" style={{marginTop:'1rem'}}>
              <p>This title runs on the OMEN Foundation platform in OMENX and GMT, under OMEN&rsquo;s rules and on OMEN&rsquo;s contracts. FyreCore is an independent third-party developer here. <Link href="/omen">How the two sections differ</Link>.</p>
            </div>
          )}
        </aside>
      </div></section>
    </article>
  );
}
