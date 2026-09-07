import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__in">
          <div>
            <Link href="/" className="mark"><i />FyreCore</Link>
            <p style={{marginTop:'.9rem',fontSize:'.82rem',color:'var(--steel)',maxWidth:'34ch'}}>
              A first-party game studio building competitive titles on an economy that cannot print its own rewards.
            </p>
          </div>
          <div><h4>Build</h4><ul>
            <li><Link href="/games">Games</Link></li>
            <li><Link href="/platform">Platform</Link></li>
            <li><Link href="/arena">Arena</Link></li>
            <li><Link href="/roadmap">Roadmap</Link></li>
            <li><Link href="/dev-log">Dev log</Link></li>
          </ul></div>
          <div><h4>Economy</h4><ul>
            <li><Link href="/token">FYRE design</Link></li>
            <li><Link href="/token#vault">The Vault</Link></li>
            <li><Link href="/ledger">Public ledger</Link></li>
            <li><Link href="/founders-pass">Founder&rsquo;s Pass</Link></li>
          </ul></div>
          <div><h4>Answers</h4><ul>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/legal">Terms and risk</Link></li>
            <li><Link href="/legal#pass">Pass terms</Link></li>
            <li><Link href="/legal#privacy">Privacy</Link></li>
          </ul></div>
        </div>
        <p className="foot__legal">
          FYRE is a design specification. No token is live, no token is for sale, and nothing on this site is an offer to sell a security or an investment of any kind. The Founder&rsquo;s Pass grants access and cosmetic items only &mdash; it carries no rewards, revenue share, or expectation of profit. &copy; {new Date().getFullYear()} FyreCore.
        </p>
      </div>
    </footer>
  );
}