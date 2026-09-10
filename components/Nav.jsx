import Link from 'next/link';
import Mark from './Mark';
import { createClient, isSupabaseConfigured } from '../lib/supabase/server';

const FULL = [
  ['/games', 'Games'], ['/omen', 'OMEN'], ['/store', 'Store'], ['/nfts', 'NFTs'], ['/boxes', 'Boxes'], ['/arena', 'Arena'],
  ['/economy', 'Economy'], ['/ledger', 'Ledger'], ['/dev', 'Developers'], ['/faq', 'FAQ'], ['/roadmap', 'Roadmap']
];
const GUEST = [['/faq', 'FAQ'], ['/terms', 'Terms']];

/** Signed out: the Forge, FAQ, Legal and one door in. Signed in: the whole platform and your Core. */
export default async function Nav(){
  let user = null;
  if (isSupabaseConfigured()) { try { ({ data: { user } } = await createClient().auth.getUser()); } catch {} }
  const links = user ? FULL : GUEST;
  const cta = user ? ['/core', 'Your Core'] : ['/join', 'Enter'];
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
        <Link href={cta[0]} className="btn btn--heat nav__cta">{cta[1]}</Link>
        <details className="menu">
          <summary aria-label="Open menu"><span /><span /><span /></summary>
          <div className="menu__panel">
            <nav aria-label="Mobile">{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}{user && <Link href="/settings">Settings</Link>}</nav>
            <Link href={cta[0]} className="btn btn--heat" style={{width:'100%',justifyContent:'center'}}>{cta[1]}</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
