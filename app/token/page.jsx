export const metadata = { title: 'FYRE' };

export default function Token(){
  return (
    <section className="section"><div className="wrap">
      <div className="note note--warn" style={{marginBottom:'2.5rem'}}><p><strong>FYRE is not live and is not for sale.</strong> This page publishes the design so it can be argued with before anything is deployed. There is no presale, no allocation you can buy, and no date.</p></div>
      <div className="head"><h2>FYRE</h2><p>A settlement rail for the platform economy. It is not the product, and its price is not the pitch.</p></div>
      <div className="alloc">
        <i style={{flex:48,background:'linear-gradient(180deg,#FFC24A,#F2A421)'}} data-l="Play 48%" />
        <i style={{flex:15,background:'linear-gradient(180deg,#FF6A3C,#FF4423)'}} data-l="Ecosystem 15%" />
        <i style={{flex:15,background:'linear-gradient(180deg,#7A8299,#5E6579)'}} data-l="Treasury 15%" />
        <i style={{flex:12,background:'linear-gradient(180deg,#3FE0A8,#22B685)'}} data-l="Team 12%" />
        <i style={{flex:10,background:'linear-gradient(180deg,#4E8BFF,#2F6BE0)'}} data-l="Liquidity 10%" />
      </div>
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>Parameter</th><th>FyreCore</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Max supply</td><td><b>1,000,000,000</b></td><td>Minted once in the constructor. The contract has no mint function at all.</td></tr>
          <tr><td>Emissions for play</td><td><b>None</b></td><td>Season rewards are funded from an existing balance. An empty treasury pays nothing.</td></tr>
          <tr><td>Team allocation</td><td><b>12%</b></td><td>12-month cliff, 36-month linear, and still subject to the same play threshold as any player</td></tr>
          <tr><td>Private sale</td><td><b>0%</b></td><td>No SAFTs. If we raise, we raise on equity.</td></tr>
          <tr><td>Float at launch</td><td><b>&le;10%</b></td><td>Community and liquidity only</td></tr>
          <tr><td>Staking</td><td><b>Access, not yield</b></td><td>Stake to unlock seasons, brackets, and crafting. Never FYRE for more FYRE.</td></tr>
        </tbody>
      </table></div>

      <div className="head" style={{marginTop:'4rem'}} id="vault"><h2>The Vault sets the floor</h2><p>Fission burns FYRE and returns a defined item pack. Fusion burns a pack and returns FYRE minus a fee. The FYRE paid in stays in the contract as reserve, so every outstanding pack has its own redemption backing on-chain.</p></div>
      <div className="flow">
        <div className="flow__row"><span className="flow__key">Fission</span><p>Burn a fixed amount of FYRE, receive a pack with fixed, published contents. Contents are not randomized: a random-contents pack bought with a token is a loot box, and loot boxes carry gambling exposure in several US states.</p></div>
        <div className="flow__row"><span className="flow__key">Fusion</span><p>Return the pack&rsquo;s items, receive FYRE minus a fee. Items used in rated play carry a lower fee than items that never left an inventory.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">Floor</span><p>Read live from the Vault and shown next to every marketplace listing. A listing cannot be priced below it.</p></div>
      </div>

      <div className="head" style={{marginTop:'4rem'}} id="transferability"><h2>Earned Transferability</h2><p>Everyone&rsquo;s FYRE begins locked and fully spendable inside the platform. It becomes transferable for an individual account once that account crosses a published play threshold.</p></div>
      <div className="tblwrap"><table className="tbl"><tbody>
        <tr><th>Threshold</th><td>200 reviewed rated matches, a completed creator sale, or a top-8 bracket placement</td></tr>
        <tr><th>Applies to</th><td>Every holder, including the team and the treasury</td></tr>
        <tr><th>Can we reverse it</th><td>No. Unlocking is one-way in the contract, so a balance cannot be frozen as punishment.</td></tr>
        <tr><th>Can we raise the bar</th><td>No. The threshold function reverts on any value above the current one. It can only be lowered.</td></tr>
        <tr><th>What it costs</th><td>Slower liquidity and a smaller float than a launchpool listing. That is the trade, made on purpose.</td></tr>
      </tbody></table></div>
    </div></section>
  );
}