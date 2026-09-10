export const metadata = { title: 'Privacy Policy' };

const UPDATED = 'September 10, 2026';

export default function Privacy(){
  return (
    <section className="section"><div className="wrap prose" style={{maxWidth:'72ch'}}>
      <div className="head"><h2>Privacy Policy</h2><p>Last updated {UPDATED}. What we collect, why, who sees it, and how to get rid of it.</p></div>

      <h3>What we collect</h3>
      <ul>
        <li><b>Account.</b> A wallet address and/or an email address, your handle, display name, bio and region if you add them, and when you signed in and from what IP and device.</li>
        <li><b>Play.</b> Match results, rating, mastery, quest progress, Embers, inventory and purchases. This is the game.</li>
        <li><b>Payments.</b> On-chain transaction hashes and the paying wallet address. These are public on the Base network whether or not we store them. We never see or store keys.</li>
        <li><b>Verification.</b> Before random boxes, paid brackets or marketplace sales you verify with our identity provider, Didit. Your documents and face scan go to Didit and never reach our servers; we receive only the outcome, your age bracket, and the issuing country of your ID.</li>
        <li><b>Fraud signals.</b> Hashed device and network signals used to detect multi-accounting and bots.</li>
      </ul>

      <h3>What we do with it</h3>
      <p>Run your Core, match you fairly, pay prizes to the right wallet, keep boxes and brackets out of reach of minors and restricted regions, stop cheating, and meet legal obligations. We do not sell personal data and we do not run advertising.</p>

      <h3>Who else sees it</h3>
      <ul>
        <li><b>Didit</b> (identity verification), <b>Supabase</b> (database and sign-in), <b>Vercel</b> (hosting). Each processes data only to provide its service to us.</li>
        <li><b>Other players</b> see your public profile if you leave it on: handle, name, bio, rating, mastery, cosmetics and verified badge. Never your email or wallet.</li>
        <li><b>The Base network</b> holds your purchases and prizes permanently and publicly; that is how it works and we cannot alter it.</li>
        <li>Authorities, where the law requires it.</li>
      </ul>

      <h3>Your controls</h3>
      <p>Edit your profile, switch it private, link or change your payout wallet, and sign out everywhere from Settings. To delete your Core and personal data, email us from the address on the account or sign a request from the linked wallet; we complete deletions within 30 days. On-chain records cannot be deleted because we do not control the chain. Verification records are retained as long as the law requires us to keep them, then deleted.</p>

      <h3>Cookies</h3>
      <p>Only the session cookie that keeps you signed in. No tracking or advertising cookies.</p>

      <h3>Children</h3>
      <p>Free play is open, but no one under 18 may buy, trade, or enter paid brackets, and verification enforces that. We do not knowingly collect data from children; if you believe we have, tell us and we will delete it.</p>

      <h3>Changes and contact</h3>
      <p>Material changes are dated at the top and announced on the dev log. Questions or requests: <a href="mailto:privacy@fyrecore.app">privacy@fyrecore.app</a>.</p>
    </div></section>
  );
}
