import Link from 'next/link';
import Mark from '../components/Mark';
import Offer from '../components/Offer';

export default function Home(){
  return (
    <>
      <section className="hero">
        <div className="hero__seam" />
        <div className="hero__orb hero__orb--a" aria-hidden="true" />
        <div className="hero__orb hero__orb--b" aria-hidden="true" />
        <div className="hero__crest" aria-hidden="true"><Mark size={440} id="crest" flat /></div>
        <div className="wrap hero__in">
          <div>
            <span className="eyebrow">Game studio &middot; competitive platform</span>
            <h1><span>Prize pools</span><span>you can trace</span><span className="grad">to a person.</span></h1>
            <p className="hero__sub">FyreCore builds its own competitive games and runs them on an economy with no reward emissions. Every payout comes from an entry fee, a sale, or a marketplace cut &mdash; never from newly printed tokens.</p>
            <div className="hero__acts">
              <Link href="/join" className="btn btn--heat">Create your Core</Link>
              <Link href="/platform" className="btn btn--ghost">How the economy works</Link>
            </div>
            <p className="hero__note">First title: Ascension, an original anime arena fighter with 20 characters and deterministic replays, playable in the browser.</p>
          </div>
          <div className="hud">
            <div className="hud__top"><span>Arena &middot; Friday Open</span><span className="live"><b />Bracket live</span></div>
            <div className="fighter">
              <div className="fighter__row"><span>KAIRO_08</span><small>1874 &middot; Blaze</small></div>
              <div className="bar"><i style={{'--hp':.82}} /></div>
            </div>
            <div className="vs">VS</div>
            <div className="fighter">
              <div className="fighter__row"><span>nine_tenths</span><small>1802 &middot; Ember</small></div>
              <div className="bar bar--b"><i style={{'--hp':.61}} /></div>
            </div>
            <dl className="hud__pool"><dt>Prize pool &middot; 64 entrants &times; $5</dt><dd>$320 USDC</dd></dl>
            <p className="hud__foot">Funded entirely by entry fees. Escrowed on-chain. Paid out in stablecoin at final.</p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <dl className="ledger">
            <div><dt>Prizes paid in</dt><dd className="pos">USDC</dd></div>
            <div><dt>Token</dt><dd className="neg">None</dd></div>
            <div><dt>Every item has a</dt><dd className="pos">Cash floor</dd></div>
            <div><dt>Revenue shown publicly</dt><dd className="pos">Live</dd></div>
          </dl>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__row">
          {[0,1].map(n => (
            <div key={n} style={{display:'flex',gap:'3rem'}}>
              <span>No token</span><span>USDC prize pools</span>
              <span>On-chain prize escrow</span><span>Redeemable item floor</span>
              <span>No loot boxes</span><span>Public revenue ledger</span>
              <span>Any currency accepted</span>
            </div>
          ))}
        </div>
      </div>

      <Offer />

      <section className="section">
        <div className="wrap">
          <div className="head head--wide">
            <span className="eyebrow">Why the economy is built this way</span>
            <h2>Three things here work differently</h2>
            <p>Most game tokens fail the same way: rewards are printed, early buyers unlock, and the price funds the payouts until it can&rsquo;t. Each of these removes one of those failure points.</p>
          </div>
          <div className="pillars">
            <article className="pillar reveal">
              <span className="pillar__tag">Proof of Play</span>
              <h3>Nothing is minted for playing</h3>
              <p>We do not issue a currency, so there is nothing to inflate. Value enters through cosmetics, entry fees, marketplace fees and creator sales, and prize money leaves in USDC. If nobody buys and nobody enters a bracket, no rewards exist.</p>
            </article>
            <article className="pillar reveal">
              <span className="pillar__tag">Earned Status</span>
              <h3>Resale is something you earn</h3>
              <p>Cosmetics you earn are yours to use immediately, and yours to resell once you cross a public play threshold. Farmers can play; they cannot flip. The bar is one-way and can only ever be lowered.</p>
            </article>
            <article className="pillar reveal">
              <span className="pillar__tag">The Vault</span>
              <h3>A floor you can redeem against</h3>
              <p>Every pack has a published redemption value in dollars, and nothing can be listed below it. The reserve behind those redemptions is held rather than spent, so the floor is a number you can check.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <h2>Where the money actually comes from</h2>
            <p>Four doors in, five drains out. The split happens in a contract, and the ledger page is built from its events rather than from a spreadsheet we maintain.</p>
          </div>
          <div className="flow">
            <div className="flow__row"><span className="flow__key">In</span><p>Cosmetic and pass purchases, tournament entry fees, marketplace fees, creator sales. All real money or assets that already exist.</p></div>
            <div className="flow__row"><span className="flow__key">Split</span><p>Revenue is divided on a fixed published policy: operations, the redemption reserve, and seeded prize pools. Every category shows up on the ledger.</p></div>
            <div className="flow__row flow__row--out"><span className="flow__key">Out</span><p>Prize pools and creator payouts in USDC. Season rewards in cosmetics and status, funded from revenue that already came in.</p></div>
            <div className="flow__row flow__row--out"><span className="flow__key">Sinks</span><p>Redemption fees, mastery progression, entry rake, marketplace fees, and seasonal Ember decay.</p></div>
            <div className="flow__row flow__row--no"><span className="flow__key">Never</span><p>Issuing a token. Selling anything to retail as an investment. Promising a return on anything.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <h2>One Core, every game</h2>
            <p>Your rating, mastery, and identity live on the platform rather than inside a single title. A new FyreCore game starts with matchmaking that already knows how good you are.</p>
          </div>
          <div className="roster">
            <Link href="/games" className="slot"><h3>Ascension</h3><span>Anime arena fighter</span><em>FyreCore &middot; playable</em></Link>
            <Link href="/games" className="slot"><h3>Rift Runner</h3><span>Arcade racer-shooter</span><em>FyreCore &middot; alpha</em></Link>
            <Link href="/omen" className="slot"><h3>Last Bastion</h3><span>Siege survival</span><em>OMEN platform</em></Link>
            <Link href="/games" className="slot"><h3>Warfront</h3><span>Tactical war</span><em>FyreCore &middot; concept</em></Link>
          </div>
          <div className="split" style={{marginTop:'1.1rem'}}>
            <div className="split__panel"><span className="eyebrow">FyreCore titles</span><h3>Our rails, any currency</h3><p>Built and owned by us. Priced in dollars; pay by card, USDC, OMENX or GMT. No token, no wallet needed to play.</p><Link href="/games" className="btn btn--ghost">FyreCore games</Link></div>
            <div className="split__panel split__panel--dim"><span className="eyebrow eyebrow--omen">OMEN titles</span><h3>Built on OMEN, by OMEN rules</h3><p>Run on the OMEN platform in OMENX and GMT, with items on OMEN contracts. We are an independent developer there.</p><Link href="/omen" className="btn btn--ghost">OMEN games</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}