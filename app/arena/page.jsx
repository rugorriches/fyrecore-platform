export const metadata = { title: 'Arena' };

export default function Arena(){
  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide"><h2>Arena</h2><p>Brackets across every FyreCore game, from free to invitational. Entry fees fund the pool, the rake is fixed when the bracket is created, and the rest is escrowed before a single match is played.</p></div>

      <div className="tblwrap" style={{marginBottom:'2.5rem'}}><table className="tbl">
        <thead><tr><th>Tier</th><th>Entry</th><th>Pool comes from</th><th>Paid in</th><th>Requires</th></tr></thead>
        <tbody>
          <tr><td><b>Open</b></td><td>Free</td><td>Platform revenue, seeded</td><td>Embers and cosmetics</td><td>A Core</td></tr>
          <tr><td><b>Ember</b></td><td>Embers</td><td>Entry fees</td><td>Cosmetics and mastery</td><td>A Core</td></tr>
          <tr><td><b>Ranked</b></td><td>$5&ndash;$50</td><td>Entry fees</td><td>USDC</td><td>Verified region</td></tr>
          <tr><td><b>High Stakes</b></td><td>$100&ndash;$500</td><td>Entry fees</td><td>USDC</td><td>Region + identity check</td></tr>
          <tr><td><b>Invitational</b></td><td>$1,000+</td><td>Entry fees and sponsors</td><td>USDC</td><td>Identity check, play threshold, seeded or qualified</td></tr>
          <tr><td><b>Founder</b></td><td>Pass holders</td><td>Seeded from platform revenue</td><td>USDC prizes and exclusive items, won by playing</td><td>Founder&rsquo;s Pass</td></tr>
        </tbody>
      </table></div>

      <div className="note"><p>The rake is capped at 10% by the escrow contract itself, not by policy, and it is shown on every bracket page before you enter. Sponsored pools are added on top of entries, never taken from them.</p></div>

      <div className="head head--wide" style={{marginTop:'4rem'}}><h2>What changes as the stakes rise</h2><p>A $5 bracket and a $1,000 bracket are the same contract. They are not the same obligations.</p></div>
      <div className="flow">
        <div className="flow__row"><span className="flow__key">Region</span><p>Paid brackets are skill contests. Some US states restrict paid entry to skill contests, so eligibility is decided from your connection at the edge and never self-declared. If your region is excluded, you can still enter Open and Ember brackets.</p></div>
        <div className="flow__row"><span className="flow__key">Identity</span><p>Above $100 in entries or $600 in winnings within a year, we are required to verify who you are and issue tax paperwork where it applies. Once, not per bracket.</p></div>
        <div className="flow__row"><span className="flow__key">Integrity</span><p>High Stakes and Invitational brackets require the play threshold, so entrants have a match history. Collusion and account sharing are checked by replay review before a pool is released.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">Server truth</span><p>Match outcomes are reported by the authoritative game server and signed, never by the client. Replays are hashed and verified, and rating anomalies queue for review before a bracket settles.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">Money back</span><p>If a bracket is cancelled, or if we never settle it before the refund deadline, you claim your entry fee back directly from the contract. It does not require our cooperation. This is true at every stake.</p></div>
      </div>

      <div className="empty" style={{marginTop:'3rem'}}><strong>No brackets yet</strong>The Arena opens with the first FyreCore title&rsquo;s soft launch. The first Ranked bracket will be a $5 entry with a published rake; High Stakes and Invitational open once the review pipeline has run on real matches.</div>
    </div></section>
  );
}