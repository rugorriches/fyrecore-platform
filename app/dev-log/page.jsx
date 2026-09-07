export const metadata = { title: 'Dev log' };

const posts = [
  { d:'2026-09-07', t:'A production environment variable that broke every build', b:'The game repo would not deploy. The cause was not the code: NODE_ENV was set to production as a system variable on the dev machine, which makes npm omit devDependencies in every project on that machine. npm ci installed 2 packages instead of 66, so the TypeScript compiler and the bundler simply were not there. Worth knowing if your builds fail in ways that make no sense.' },
  { d:'2026-09-07', t:'Sign-in, and the rule that no browser writes value', b:'The platform now has magic-link sign-in, a Core dashboard, and a service layer. The rule the whole thing is built on: no value-bearing write ever comes from a browser. The user identity comes from the session cookie rather than the request body, reward amounts are read from the database rather than accepted from the client, and the admin client throws at import time if it is ever loaded in the browser, which turns a leaked service key into a build failure instead of a silent disaster.' },
  { d:'2026-09-05', t:'Nine contracts, and the three we were missing', b:'The token, vault, items, pass, escrow, registry and vesting were done. Writing the ledger page made it obvious that three pieces of the economy had no contract at all: the marketplace that FYRE was supposed to be spendable in, the distributor that turns a finished season into FYRE, and the router that splits revenue and executes buybacks. Without the router in particular, rewards are funded by revenue was a claim with nothing behind it.' },
  { d:'2026-09-05', t:'A bug in the Embers ledger', b:'Balances were being written by the service alongside the append-only ledger, which means any missed write silently desyncs the one number the whole economy is measured against. Balances are now derived by a database trigger, the ledger rejects updates and deletes outright, and the season earn cap is enforced in the database rather than trusted to application code.' },
  { d:'2026-09-05', t:'No emissions, ever', b:'The first design decision was to delete the reward emission schedule. Ninety-three percent of web3 game projects are dead, and the common thread is paying rewards in freshly minted supply until new buyers stop arriving. The replacement is narrower and slower: entry fees, cosmetics, marketplace cuts, and creator sales, with a contract that has no mint function to fall back on.' }
];

export default function DevLog(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Dev log</h2><p>Weekly build notes, including the parts that went wrong. For a studio with no track record this is the only credible marketing there is.</p></div>
      {posts.map(p => (
        <article className="post" key={p.t}>
          <time dateTime={p.d}>{new Date(p.d + 'T00:00:00Z').toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', timeZone:'UTC' })}</time>
          <h3>{p.t}</h3><p>{p.b}</p>
        </article>
      ))}
    </div></section>
  );
}