import Link from 'next/link';

export default function Home(){
  return (
    <>
      <section className="hero">
        <div className="hero__seam" />
        <div className="wrap hero__in">
          <div>
            <h1><span>Prize pools</span><span>you can trace</span><span>to a person.</span></h1>
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
            <div><dt>Reward emissions</dt><dd className="neg">Zero</dd></div>
            <div><dt>Tokens sold to the public</dt><dd className="neg">None</dd></div>
            <div><dt>Every item&rsquo;s redeemable floor</dt><dd className="pos">On&#8209;chain</dd></div>
            <div><dt>Revenue shown publicly</dt><dd className="pos">Live</dd></div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <h2>Three things here work differently</h2>
            <p>Most game tokens fail the same way: rewards are printed, early buyers unlock, and the price funds the payouts until it can&rsquo;t. Each of these removes one of those failure points.</p>
          </div>
          <div className="pillars">
            <article className="pillar">
              <span className="pillar__tag">Proof of Play</span>
              <h3>Nothing is minted for playing</h3>
              <p>There is no emission schedule and no mint function on the token. Value enters through cosmetics, entry fees, marketplace fees, and creator sales. If nobody buys and nobody enters a bracket, no rewards exist.</p>
            </article>
            <article className="pillar">
              <span className="pillar__tag">Earned Transferability</span>
              <h3>Your tokens unlock when you play</h3>
              <p>FYRE starts locked for everyone and is fully spendable in the platform from day one. It becomes transferable for you once you cross a public play threshold. Farmers can spend; they can never sell.</p>
            </article>
            <article className="pillar">
              <span className="pillar__tag">The Vault</span>
              <h3>A floor you can redeem against</h3>
              <p>Burn FYRE for a defined item pack, or burn a pack back into FYRE. The FYRE stays in the vault as reserve, so every pack has its own redemption backing sitting on-chain.</p>
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
            <div className="flow__row"><span className="flow__key">Split</span><p>Revenue lands in a router that divides it on-chain: operations, buyback, reserve. Every deposit is categorised and emitted.</p></div>
            <div className="flow__row flow__row--out"><span className="flow__key">Out</span><p>Prize pools and creator payouts in stablecoin. Season rewards in FYRE bought on the open market, never created.</p></div>
            <div className="flow__row flow__row--out"><span className="flow__key">Sinks</span><p>Vault fusion fees, mastery progression, entry rake, marketplace fees, and seasonal Ember decay.</p></div>
            <div className="flow__row flow__row--no"><span className="flow__key">Never</span><p>Minting tokens to pay rewards. Selling tokens to retail. Promising a return on anything.</p></div>
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
            <Link href="/games" className="slot"><h3>Ascension</h3><span>Anime arena fighter</span><em>Playable build &middot; first title</em></Link>
            <Link href="/games" className="slot"><h3>Warfront</h3><span>Tactical war</span><em>Concept</em></Link>
            <Link href="/games" className="slot"><h3>Breachpoint</h3><span>First-person shooter</span><em>Concept</em></Link>
            <Link href="/games" className="slot"><h3>Ashlands</h3><span>Open world</span><em>Concept</em></Link>
          </div>
        </div>
      </section>
    </>
  );
}