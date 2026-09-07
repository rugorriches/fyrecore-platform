import Link from 'next/link';

export default function Nav(){
  return (
    <header className="nav">
      <div className="wrap nav__in">
        <Link href="/" className="mark"><i />FyreCore</Link>
        <nav className="nav__links" aria-label="Main">
          <Link href="/games">Games</Link>
          <Link href="/platform">Platform</Link>
          <Link href="/arena">Arena</Link>
          <Link href="/token">FYRE</Link>
          <Link href="/ledger">Ledger</Link>
          <Link href="/founders-pass">Pass</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/dev-log">Dev log</Link>
          <Link href="/roadmap">Roadmap</Link>
        </nav>
        <Link href="/join" className="btn btn--heat nav__cta">Create your Core</Link>
      </div>
    </header>
  );
}