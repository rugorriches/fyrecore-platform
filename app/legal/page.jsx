export const metadata = { title: 'Terms and risk' };

export default function Legal(){
  return (
    <section className="section"><div className="wrap prose" style={{maxWidth:'72ch'}}>
      <div className="head"><h2>Terms and risk</h2><p>Written to be read rather than to be scrolled past. If any of it is unclear, that is a fault worth telling us about.</p></div>
      <div className="note note--warn"><p>FyreCore is an early-stage project built by a very small team. Ascension is not finished. FyreCore does not issue a token. Nothing here is an offer of a security, and nothing here should be treated as financial advice.</p></div>
      <h3 id="pass">VIP Pass</h3>
      <p>The pass is a product. It grants early access to FyreCore titles and cosmetic items, and nothing else. It pays no rewards, distributes no revenue, confers no ownership in FyreCore, and carries no expectation of profit. The contract contains no payout function and none will be added.</p>
      <ul>
        <li>Passes are non-transferable for twelve months from mint, enforced by the contract.</li>
        <li>Benefits depend on titles that are still in development and may change as those titles change.</li>
        <li>Purchases are paid in USDC on Base and are final once the transaction confirms. There is no processor in the middle to reverse them.</li>
        <li>Not offered where prohibited by local law.</li>
      </ul>
      <h3>No token</h3>
      <p>FyreCore does not issue, sell, or plan a cryptocurrency. Entry fees, prize pools and marketplace settlement are in USDC, a third-party stablecoin we neither control nor profit from holding. Passes, cosmetics, packs and boxes are bought in USDC on the Base network from a wallet you control; FyreCore never holds your keys or your funds. Any &ldquo;FYRE&rdquo; token offered for sale anywhere is not connected to us.</p>
      <h3>Two sections</h3>
      <p>FyreCore-section titles run on contracts and rails we own. OMEN-section titles are built by the same developer on the OMEN platform and use OMEN currencies and OMEN contracts. FyreCore is an independent third-party developer on that platform with no ownership stake in it. The two economies are unconnected, and nothing transfers between them.</p>
      <h3>Tournaments</h3>
      <p>Paid brackets are skill-based competition. Entry fees are escrowed on-chain before the first match and the platform rake is fixed and visible when a bracket is created. If a bracket is cancelled or not settled by its refund deadline, entrants may reclaim their entry fee directly from the contract without our involvement. Paid entry is unavailable where local law restricts it.</p>
      <h3>Packs and boxes</h3>
      <p>Vault packs have fixed, published contents and their items are tradeable and redeemable. Random boxes drop cosmetic items only; those items are bound to the purchasing account and can never be sold, traded, or redeemed for any currency, and duplicates convert only to non-transferable Embers. Odds are published for every box. Boxes require age and identity verification and are not offered in jurisdictions that prohibit them, including Belgium and the Netherlands. No purchase affects gameplay.</p>
      <h3 id="privacy">Privacy</h3>
      <p>We collect what is needed to run an account and stop fraud: an email address, a handle, gameplay records, and hashed device and network signals used to detect multi-accounting. Payments are on-chain transactions: we store the transaction hash and the paying wallet address, which are public on the Base network anyway, and never a key. Identity verification documents stay with the verification provider and never reach our servers. We do not sell personal data. You can request deletion of your account and personal data at any time; on-chain records cannot be deleted because we do not control the chain.</p>
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