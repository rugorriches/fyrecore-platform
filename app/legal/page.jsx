export const metadata = { title: 'Terms and risk' };

export default function Legal(){
  return (
    <section className="section"><div className="wrap prose" style={{maxWidth:'72ch'}}>
      <div className="head"><h2>Terms and risk</h2><p>Written to be read rather than to be scrolled past. If any of it is unclear, that is a fault worth telling us about.</p></div>
      <div className="note note--warn"><p>FyreCore is an early-stage project built by a very small team. Ascension is not finished. FYRE does not exist on any live network. Nothing here is an offer of a security, and nothing here should be treated as financial advice.</p></div>
      <h3 id="pass">Founder&rsquo;s Pass</h3>
      <p>The pass is a product. It grants early access to FyreCore titles and cosmetic items, and nothing else. It pays no rewards, distributes no revenue, confers no ownership in FyreCore, and carries no expectation of profit. The contract contains no payout function and none will be added.</p>
      <ul>
        <li>Passes are non-transferable for twelve months from mint, enforced by the contract.</li>
        <li>Benefits depend on titles that are still in development and may change as those titles change.</li>
        <li>Purchases are final once the pass is minted. Refunds before mint follow the payment processor terms.</li>
        <li>Not offered where prohibited by local law.</li>
      </ul>
      <h3>FYRE</h3>
      <p>FYRE is a published design, not a live asset. There is no presale, no private allocation, and no way to buy it. If it is ever deployed it will be distributed to people who played and to pass holders, as a locked balance, and it will only become transferable per account through the play threshold described on the token page.</p>
      <h3>Tournaments</h3>
      <p>Paid brackets are skill-based competition. Entry fees are escrowed on-chain before the first match and the platform rake is fixed and visible when a bracket is created. If a bracket is cancelled or not settled by its refund deadline, entrants may reclaim their entry fee directly from the contract without our involvement. Paid entry is unavailable where local law restricts it.</p>
      <h3>Item packs</h3>
      <p>Vault packs have fixed, published contents. There is no randomized pack, no loot box, and no gambling mechanic anywhere in the platform.</p>
      <h3 id="privacy">Privacy</h3>
      <p>We collect what is needed to run an account and stop fraud: an email address, a handle, gameplay records, and hashed device and network signals used to detect multi-accounting. Payment details are handled by our payment processor and never reach our servers. We do not sell personal data. You can request deletion of your account and personal data at any time; on-chain records cannot be deleted because we do not control the chain.</p>
      <h3>Risks worth stating plainly</h3>
      <ul>
        <li>A two-person studio may fail to ship. If FyreCore stops development, passes may lose all practical value.</li>
        <li>Smart contracts can contain bugs. Nothing goes to mainnet before two independent audits, but an audit is not a guarantee.</li>
        <li>Regulation around game tokens and digital collectibles is unsettled and may force changes to the design or restrict access by region.</li>
        <li>No part of this platform is designed to make you money, and it should not be approached as an investment.</li>
      </ul>
    </div></section>
  );
}