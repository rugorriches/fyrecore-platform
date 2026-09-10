import Link from 'next/link';
import Forge from '../components/Forge';

/** Home: one moment, two actions. Everything explanatory lives on /platform, /economy and /games. */
export default function Home(){
  return (
    <>
      <Forge />

      <section className="section section--tight" id="games">
        <div className="wrap">
          <div className="roster">
            <Link href="/games" className="slot"><h3>Ascension</h3><span>Anime arena fighter</span><em>FyreCore &middot; playable</em></Link>
            <Link href="/games" className="slot"><h3>Rift Runner</h3><span>Arcade racer-shooter</span><em>FyreCore &middot; alpha</em></Link>
            <Link href="/games" className="slot"><h3>Warfront</h3><span>Fantasy RTS</span><em>FyreCore &middot; in development</em></Link>
            <Link href="/omen" className="slot"><h3>Last Bastion</h3><span>Siege survival</span><em>OMEN platform</em></Link>
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
