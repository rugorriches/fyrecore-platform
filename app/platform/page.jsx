export const metadata = { title: 'Platform' };

export default function Platform(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>The platform</h2><p>Six systems. You sign in once, and everything below follows you into every FyreCore game.</p></div>
      <div className="pillars">
        <article className="pillar"><span className="pillar__tag">Core</span><h3>Your identity</h3><p>Sign in with an email. A wallet is created for you and you never see a seed phrase. Your rating, mastery, and cosmetics belong to the Core rather than to one title.</p></article>
        <article className="pillar"><span className="pillar__tag">Arena</span><h3>Brackets and prize pools</h3><p>Enter with nothing, with Embers, or with a card. Pools are escrowed before the first match. If we go silent past the refund deadline, you reclaim your fee yourself.</p></article>
        <article className="pillar"><span className="pillar__tag">Forge</span><h3>Marketplace and creator tools</h3><p>Trade items with other players. A listing cannot be priced below its Vault floor, because underpricing only ever feeds bots watching the order book. Creators keep 70%.</p></article>
        <article className="pillar"><span className="pillar__tag">Vault</span><h3>Redemption both ways</h3><p>Turn FYRE into a defined item pack, or turn packs back into FYRE minus a fee. Items used in rated play redeem at a lower fee than items that only sat in an inventory.</p></article>
        <article className="pillar"><span className="pillar__tag">Embers</span><h3>What you earn by playing</h3><p>A seasonal currency you cannot buy or transfer. Spend it on mastery, cosmetics, and Ember-tier brackets. Unspent Embers decay when a season ends.</p></article>
        <article className="pillar"><span className="pillar__tag">Ledger</span><h3>The books, in public</h3><p>Revenue in, buybacks executed, prizes paid, treasury held. Built from contract events rather than from a report we write ourselves.</p></article>
      </div>
      <div className="head" style={{marginTop:'4rem'}}><h2>Why Embers and FYRE are separate</h2><p>Almost every collapsed game economy paid rewards in its tradable token. Ninety percent of reward volume here lands in Embers, which have no market and no exit.</p></div>
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th></th><th>Embers</th><th>FYRE</th></tr></thead>
        <tbody>
          <tr><th>How you get it</th><td>Playing, quests, placements</td><td>Season conversion, Founder&rsquo;s Pass, buying it</td></tr>
          <tr><th>Can you buy it</th><td>No</td><td>Yes, once transferable</td></tr>
          <tr><th>Can you trade it</th><td>Never</td><td>After you cross the play threshold</td></tr>
          <tr><th>Does it expire</th><td>Decays 50% at season end</td><td>No</td></tr>
          <tr><th>What it&rsquo;s for</th><td>Mastery, cosmetics, Ember brackets</td><td>Marketplace, Vault, open brackets</td></tr>
        </tbody>
      </table></div>
    </div></section>
  );
}