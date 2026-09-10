import Link from 'next/link';

export const metadata = { title: 'Legal' };

/** Index of everything legal, plus the short version of each. */
export default function Legal(){
  const docs = [
    ['/terms', 'Terms of Service', 'The agreement: your Core, tournaments, purchases, conduct, risks, liability.'],
    ['/privacy', 'Privacy Policy', 'What we collect, why, who processes it, and how to delete it.'],
    ['/terms#pass', 'Founder\u2019s Pass terms', 'Early access, cosmetics and founder brackets won by play. Not an investment.'],
  ];
  return (
    <section className="section"><div className="wrap prose" style={{maxWidth:'72ch'}}>
      <div className="head"><h2>Legal</h2><p>Everything binding, in one place, written to be read.</p></div>
      <div className="flow">
        {docs.map(([href, t, d]) => (
          <Link key={href} href={href} className="flow__row" style={{display:'flex'}}><span className="flow__key">{t}</span><p>{d}</p></Link>
        ))}
      </div>
      <h3 style={{marginTop:'3rem'}}>The short version</h3>
      <ul>
        <li>FyreCore does not issue a token and is not planning one. Any &ldquo;FYRE&rdquo; token is a scam.</li>
        <li>Prizes are won by playing and paid in USDC to a wallet you control. We never hold your keys or funds.</li>
        <li>Nothing here is an investment, a security, or financial advice. No purchase yields anything on its own.</li>
        <li>Paid brackets, random boxes and marketplace sales require age and identity verification and are unavailable where local law restricts them.</li>
        <li>On-chain purchases are final once confirmed. If we fail to deliver, we make it right.</li>
        <li>Your data is used to run your Core and stop fraud, never sold. Delete it any time from Settings or by request.</li>
      </ul>
      <p style={{marginTop:'2rem'}}>Contact: <a href="mailto:hello@fyrecore.app">hello@fyrecore.app</a> &middot; Privacy requests: <a href="mailto:privacy@fyrecore.app">privacy@fyrecore.app</a></p>
    </div></section>
  );
}
