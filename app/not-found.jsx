import Link from 'next/link';

export default function NotFound(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>No such page</h2><p>That route does not exist. It may have been renamed while the platform is being built.</p></div>
      <Link href="/" className="btn btn--heat">Back to the front</Link>
    </div></section>
  );
}