export const metadata = { title: 'Terms of Service' };

const UPDATED = 'September 10, 2026';

export default function Terms(){
  return (
    <section className="section"><div className="wrap prose" style={{maxWidth:'72ch'}}>
      <div className="head"><h2>Terms of Service</h2><p>Last updated {UPDATED}. Written to be read. If any of it is unclear, that is a fault worth telling us about.</p></div>
      <div className="note note--warn"><p>FyreCore is an early-stage studio run by a very small team. Its titles are unfinished. FyreCore does not issue a token. Nothing here is an offer of a security, and nothing here is financial advice.</p></div>

      <h3>1. The agreement</h3>
      <p>By creating a Core or using fyrecore.app you agree to these terms and to the <a href="/privacy">Privacy Policy</a>. You must be at least 18, or the age of majority where you live if higher, to buy anything, enter a paid bracket, or trade. Free play is open to anyone permitted to use the site under local law.</p>

      <h3>2. Your Core</h3>
      <p>Your account is yours to keep secure. You sign in with a wallet you control or an email link. We never hold your keys or your funds. One person, one Core: multi-accounting to farm rewards, brackets or the marketplace is a breach and forfeits what was gained. You may delete your Core at any time from Settings.</p>

      <h3 id="pass">3. Founder&rsquo;s Pass</h3>
      <p>The Founder&rsquo;s Pass is a product, not an investment. It grants early access to FyreCore titles before public release, exclusive founder cosmetics and a founder badge on your Core, a say in playtests and feedback rounds, and entry to founder-only brackets and drops. Those brackets and drops are seeded from platform revenue on a published schedule and are <em>won by playing</em>: nothing is paid for merely holding the pass. There is no dividend, no revenue share, no ownership in FyreCore, and no expectation of profit. The pass contract contains no payout function and none will be added.</p>
      <ul>
        <li>Passes are non-transferable for twelve months from mint, enforced by the contract.</li>
        <li>Benefits depend on titles still in development and may change as those titles change. Seeding for founder brackets is disclosed on the public ledger.</li>
        <li>Purchases are in USDC on Base and are final once the transaction confirms.</li>
        <li>Not offered where prohibited by local law.</li>
      </ul>

      <h3>4. No token</h3>
      <p>FyreCore does not issue, sell, or plan a cryptocurrency. Entry fees, prize pools and marketplace settlement are in USDC, a third-party stablecoin we neither control nor profit from holding. Everything we sell is bought in USDC on the Base network from a wallet you control. Any &ldquo;FYRE&rdquo; token offered anywhere is not connected to us.</p>

      <h3>5. Two sections</h3>
      <p>FyreCore-section titles run on contracts and rails we own. OMEN-section titles are built by the same developer on the OMEN platform and use OMEN currencies and contracts under OMEN&rsquo;s rules; FyreCore is an independent third-party developer there with no ownership stake. The two economies are unconnected and nothing transfers between them.</p>

      <h3>6. Tournaments</h3>
      <p>Paid brackets are skill-based competition. Entry fees are escrowed on-chain before the first match; the rake is fixed and shown when a bracket is created; prizes are paid in USDC to the wallet linked on your Core. If a bracket is cancelled or not settled by its refund deadline, entrants reclaim their fee directly from the contract without our involvement. Paid entry is unavailable where local law restricts it. Cheating, collusion, or match-fixing forfeits entry and winnings.</p>

      <h3>7. Store, packs and boxes</h3>
      <p>Store items and Vault packs have fixed, published contents; their items are tradeable and redeemable. Random boxes drop cosmetic items only; those items are bound to the purchasing account and can never be sold, traded, or redeemed for any currency, and duplicates convert only to non-transferable Embers. Odds are published for every box. Boxes require age and identity verification and are not offered where prohibited, including Belgium and the Netherlands. No purchase affects gameplay outcomes.</p>

      <h3>8. Payments and refunds</h3>
      <p>All purchases are on-chain USDC transactions from your wallet to our contract at a price our server signed for your order. They are final once the transaction confirms; there is no processor in the middle to reverse them. If our server fails to deliver what you paid for, contact us with the transaction hash and we will make it right.</p>

      <h3>9. Content and conduct</h3>
      <p>Your handle, display name and bio must not impersonate others or contain hateful, sexual, or illegal content. We may remove content and suspend Cores that breach these terms, cheat, or abuse other players. Game clients, art and code are FyreCore&rsquo;s property or licensed to it; you receive a licence to play, not ownership, except for items recorded on-chain to your wallet.</p>

      <h3>10. Risks worth stating plainly</h3>
      <ul>
        <li>A small studio may fail to ship. If FyreCore stops development, passes and items may lose all practical value.</li>
        <li>Smart contracts can contain bugs. Nothing goes to mainnet before independent audits, but an audit is not a guarantee.</li>
        <li>Regulation around digital items and prize competitions is unsettled and may force design changes or regional restrictions.</li>
        <li>No part of this platform is designed to make you money and it should not be approached as an investment.</li>
      </ul>

      <h3>11. Liability and changes</h3>
      <p>The service is provided as-is. To the fullest extent the law allows, FyreCore is not liable for indirect or consequential losses, lost profits, or losses arising from wallets, networks or providers we do not control. We may update these terms; material changes are dated at the top and announced on the dev log. Continued use after a change is acceptance. These terms are governed by the laws of the State of Maryland, USA.</p>
      <p>Questions: <a href="mailto:hello@fyrecore.app">hello@fyrecore.app</a></p>
    </div></section>
  );
}
