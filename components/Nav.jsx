import Link from 'next/link';
import Mark from './Mark';

const links = [
  ['/games', 'Games'], ['/omen', 'OMEN'], ['/nfts', 'NFTs'], ['/boxes', 'Boxes'], ['/arena', 'Arena'],
  ['/economy', 'Economy'], ['/ledger', 'Ledger'], ['/dev', 'Developers'],
  ['/faq', 'FAQ'], ['/roadmap', 'Roadmap']
];

export default function Nav(){
  return (
    <header className="nav">
      <div className="wrap nav__in">
        <Link href="/" className="mark">
          <span className="mark__glyph"><Mark size={30} id="nav" /></span>
          <span className="mark__word">Fyre<span>Core</span></span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <Link href="/join" className="btn btn--heat nav__cta">Create your Core</Link>

        <details className="menu">
          <summary aria-label="Open menu"><span /><span /><span /></summary>
          <div className="menu__panel">
            <nav aria-label="Mobile">
              {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
            <Link href="/join" className="btn btn--heat" style={{width:'100%',justifyContent:'center'}}>Create your Core</Link>
          </div>
        </details>
      </div>
    </header>
  );
}