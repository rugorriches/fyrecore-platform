import Link from 'next/link';
import Forge from '../components/Forge';
import { createClient, isSupabaseConfigured } from '../lib/supabase/server';
import { STATUS } from '../lib/data';

export const revalidate = 300;

/** Home: one moment, two actions. Everything explanatory lives on /platform, /economy and /games. */
export default async function Home(){
  let roster = [];
  if (isSupabaseConfigured()) {
    const { data } = await createClient().from('games')
      .select('slug, name, genre, section, status, art_url, preview, featured')
      .order('featured', { ascending: false }).order('sort_order', { ascending: false }).limit(4);
    roster = data ?? [];
  }
  return (
    <>
      <Forge />

      <section className="section section--tight" id="games">
        <div className="wrap">
          <div className="roster">
            {roster.map(g => {
              const label = g.preview ? 'In development' : (STATUS[g.status] ?? g.status);
              const body = (
                <>
                  {g.art_url && <img className="slot__art" src={g.art_url} alt="" loading="lazy" />}
                  <span className="slot__body">
                    <h3>{g.name.replace(/^OMEN:\s*/, '')}</h3>
                    <span>{g.genre}</span>
                    <em>{g.section === 'omen' ? 'OMEN platform' : 'FyreCore'} &middot; {label}</em>
                  </span>
                </>
              );
              const cls = `slot${g.art_url ? ' slot--art' : ''}`;
              return g.preview
                ? <div className={cls} key={g.slug}>{body}</div>
                : <Link href={`/games/${g.slug}`} className={cls} key={g.slug}>{body}</Link>;
            })}
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__row">
          {[0,1].map(n => (
            <div key={n} style={{display:'flex',gap:'3rem'}}>
              <span>No token</span><span>USDC prize pools</span><span>On-chain escrow</span>
              <span>Redeemable item floor</span><span>Box drops never cash out</span><span>Public revenue ledger</span><span>Paid in USDC on Base</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <dl className="ledger">
            <div><dt>Prizes paid in</dt><dd className="pos">USDC</dd></div>
            <div><dt>Token</dt><dd className="neg">None</dd></div>
            <div><dt>Every item has a</dt><dd className="pos">Cash floor</dd></div>
            <div><dt>Revenue shown publicly</dt><dd className="pos">Live</dd></div>
          </dl>
          <div className="split" style={{marginTop:'2.5rem'}}>
            <div className="split__panel"><h3>One Core, every game</h3><p>Your rating, mastery and cosmetics live on the platform, not inside one title. Sign in with a wallet or an email; play free; connect a wallet only when money is involved.</p><Link href="/platform" className="btn btn--ghost">How it works</Link></div>
            <div className="split__panel split__panel--dim"><h3>Where the money comes from</h3><p>Entry fees, sales and marketplace cuts in. Prize pools and creator payouts out, in USDC. Nothing printed, and every category on a public ledger.</p><Link href="/economy" className="btn btn--ghost">The economy</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
