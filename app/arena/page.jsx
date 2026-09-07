export const metadata = { title: 'Arena' };

export default function Arena(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Arena</h2><p>Brackets across every FyreCore game. Entry fees fund the pool, the rake is fixed when the bracket is created, and the rest is escrowed before a single match is played.</p></div>
      <div className="tblwrap" style={{marginBottom:'2.5rem'}}><table className="tbl">
        <thead><tr><th>Tier</th><th>Entry</th><th>Pool comes from</th><th>Paid in</th></tr></thead>
        <tbody>
          <tr><td><b>Open</b></td><td>Free</td><td>Platform revenue, seeded</td><td>Embers and cosmetics</td></tr>
          <tr><td><b>Ember</b></td><td>Embers</td><td>Entry fees</td><td>Cosmetics and mastery</td></tr>
          <tr><td><b>Ranked</b></td><td>$5&ndash;$25</td><td>Entry fees</td><td>USDC</td></tr>
          <tr><td><b>Founder</b></td><td>Pass holders</td><td>Platform revenue</td><td>USDC and exclusive items</td></tr>
        </tbody>
      </table></div>
      <div className="note"><p>The rake is capped at 10% by the escrow contract itself, not by policy, and it is shown on every bracket page before you enter.</p></div>
      <div className="head" style={{marginTop:'4rem'}}><h2>Two guarantees</h2></div>
      <div className="flow">
        <div className="flow__row"><span className="flow__key">Server truth</span><p>Match outcomes are reported by the authoritative game server and signed, never by the client. Replays are hashed and verified against a state hash, and rating anomalies queue for review before a bracket settles.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">Money back</span><p>If a bracket is cancelled, or if we never settle it before the refund deadline, you claim your entry fee back directly from the contract. It does not require our cooperation.</p></div>
      </div>
      <div className="empty" style={{marginTop:'3rem'}}><strong>No brackets yet</strong>The Arena opens with the Ascension soft launch. The first Ranked bracket will be a $5 entry with a published rake.</div>
    </div></section>
  );
}