import Link from 'next/link';
import Mark from './Mark';

export default function Footer(){
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__in">
          <div>
            <Link href="/" className="mark"><span className="mark__glyph"><Mark size={28} id="ft" /></span><span className="mark__word">Fyre<span>Core</span></span></Link>
            <p style={{marginTop:'.9rem',fontSize:'.82rem',color:'var(--steel)',maxWidth:'34ch'}}>
              A first-party game studio building competitive titles on an economy that cannot print its own rewards.
            </p>
          </div>
          <div><h4>Build</h4><ul>
            <li><Link href="/games">FyreCore games</Link></li>
            <li><Link href="/omen">OMEN games</Link></li>
            <li><Link href="/nfts">NFTs</Link></li>
            <li><Link href="/dev">Developer portal</Link></li>
            <li><Link href="/platform">Platform</Link></li>
            <li><Link href="/arena">Arena</Link></li>
            <li><Link href="/roadmap">Roadmap</Link></li>
            <li><Link href="/dev-log">Dev log</Link></li>
          </ul></div>
          <div><h4>Economy</h4><ul>
            <li><Link href="/economy">How the economy works</Link></li>
            <li><Link href="/economy#vault">The Vault</Link></li>
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
          FyreCore does not issue a token and is not planning one. Nothing on this site is an offer to sell a security or an investment of any kind. The Founder&rsquo;s Pass grants access and cosmetic items only &mdash; it carries no rewards, revenue share, or expectation of profit. Nova Kata and Rift Runner are separate OMEN-platform titles with their own economies. &copy; {new Date().getFullYear()} FyreCore.
        </p>
      </div>
    </footer>
  );
}