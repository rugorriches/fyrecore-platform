export const metadata = { title: 'Economy' };

export default function Economy(){
  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow">How money moves here</span>
        <h2>No token. Prize money is money.</h2>
        <p>Entry fees, prize pools and payouts are in USDC. Passes and cosmetics are bought with a card. FyreCore does not issue a currency, and there is nothing here to speculate on.</p>
      </div>

      <div className="note note--warn" style={{marginBottom:'2.5rem'}}>
        <p><strong>FyreCore has no token and is not planning one.</strong> If you see a &ldquo;FYRE&rdquo; token being sold anywhere, it is not us and it is a scam. We designed one, published the design, and then cut it &mdash; the reasoning is below.</p>
      </div>

      <div className="tblwrap" style={{marginBottom:'4rem'}}><table className="tbl">
        <thead><tr><th>What</th><th>Paid in</th><th>Who receives it</th></tr></thead>
        <tbody>
          <tr><td><b>Tournament entry</b></td><td>USDC or card</td><td>Escrowed, then the winners</td></tr>
          <tr><td><b>Prize pools</b></td><td>USDC</td><td>Placings, paid at the final</td></tr>
          <tr><td><b>Founder&rsquo;s Pass</b></td><td>Card</td><td>FyreCore &mdash; funds art and prize seeding</td></tr>
          <tr><td><b>Cosmetics</b></td><td>Card, USDC, OMENX or GMT</td><td>FyreCore, or 70% to the creator</td></tr>
          <tr><td><b>Marketplace sale</b></td><td>USDC</td><td>Seller, minus a 5% fee</td></tr>
          <tr><td><b>Embers</b></td><td>Earned only</td><td>You &mdash; not transferable, not for sale</td></tr>
        </tbody>
      </table></div>

      <div className="head head--wide"><h2>Why we cut the token</h2>
        <p>We had it designed: fixed supply, no presale, no team allocation, unlock gated on play. It was a careful design. We cut it anyway.</p></div>
      <div className="flow">
        <div className="flow__row flow__row--no"><span className="flow__key">The record</span><p>Roughly 93% of web3 game projects are dead. Of forty-one token sales since 2025, six are profitable. Every surviving game token we studied fell 95&ndash;99% from its peak while the platforms underneath kept earning fees. The pattern is not subtle.</p></div>
        <div className="flow__row flow__row--no"><span className="flow__key">The cost</span><p>Two audits, token counsel, and launch liquidity run past six figures before a single match is played. Spent on a two-person studio, that money buys a finished game instead.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">What we lose</span><p>Speculation, an airdrop hype cycle, and the attention that comes with both. That is a real loss and we are choosing it on purpose.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">What we keep</span><p>Everything that made the design worth publishing: a redeemable floor under every item, escrowed prize money, a public ledger, and rewards that can only come from revenue.</p></div>
      </div>

      <div className="head head--wide" style={{marginTop:'4rem'}} id="vault"><h2>The Vault still sets a floor</h2>
        <p>The floor mechanic never needed a token &mdash; it needed a unit of account. That unit is now the dollar.</p></div>
      <div className="flow">
        <div className="flow__row"><span className="flow__key">Buy</span><p>A cosmetic pack has fixed, published contents at a fixed price, and those items can be traded and redeemed. Random boxes are a separate thing: their drops are cosmetic, bound to your account, and can never be sold or redeemed. Random contents or cash-out, never both on the same item.</p></div>
        <div className="flow__row"><span className="flow__key">Redeem</span><p>Return a pack&rsquo;s items and receive USDC back, minus a fee. Items used in rated play redeem at a lower fee than items that sat untouched in an inventory.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">Floor</span><p>Every marketplace listing shows its redemption value, and nothing can be listed below it. The reserve backing those redemptions is held, not spent.</p></div>
      </div>

      <div className="head head--wide" style={{marginTop:'4rem'}}><h2>Earned status, still</h2>
        <p>The play threshold survived the token. It now governs what your account can do rather than what it can sell.</p></div>
      <div className="tblwrap"><table className="tbl"><tbody>
        <tr><th>Threshold</th><td>200 reviewed rated matches, a completed creator sale, or a top-8 bracket placement</td></tr>
        <tr><th>What it unlocks</th><td>Resale of earned cosmetics, creator publishing, and seeded bracket seats</td></tr>
        <tr><th>What counts</th><td>Reviewed matches only. Results arrive signed from the game server and land pending review, so a private bot farm moves nothing.</td></tr>
        <tr><th>Can we reverse it</th><td>No. Unlocking is one-way and the bar can only ever be lowered, never raised.</td></tr>
      </tbody></table></div>

      <div className="note" style={{marginTop:'2.5rem'}}>
        <p>Last Bastion and other OMEN-section titles use OMEN&rsquo;s currencies. FyreCore titles do not. If you play both, they are different economies and nothing crosses between them.</p>
      </div>
    </div></section>
  );
}