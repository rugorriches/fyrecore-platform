import Link from 'next/link';

const offer = [
  { k:'01', t:'Games worth playing first',
    d:'Original competitive titles built in-house. Ascension is a browser anime fighter with 20 characters, five stages and deterministic replays. No install, no wallet, no crypto required to play.',
    a:['20 characters, 5 stages','Frame-data combat','Runs in a browser'], href:'/games', cta:'See the games' },
  { k:'02', t:'One Core across every title',
    d:'A single identity carrying your rating, mastery and cosmetics. Sign in with an email and a wallet is made for you. Every new FyreCore game already knows how good you are.',
    a:['Email sign-in','Cross-game rating','No seed phrases'], href:'/platform', cta:'How it works' },
  { k:'03', t:'Brackets with real prize money',
    d:'Entry fees are escrowed on-chain before the first match and paid in stablecoin at the final. The rake is capped at 10% in the contract, and you can reclaim your fee yourself if we never settle.',
    a:['USDC payouts','10% rake ceiling','Permissionless refunds'], href:'/arena', cta:'Enter the Arena' },
  { k:'04', t:'Items with a floor you can check',
    d:'Trade cosmetics with other players. Every listing shows a redemption value read live from the Vault, and nothing can be listed below it. Packs are fixed; box drops are bound and never cash out.',
    a:['USD floor','Bound box drops','Creators keep 70%'], href:'/economy#vault', cta:'See the Vault' }
];

export default function Offer(){
  return (
    <section className="section" id="offer">
      <div className="wrap">
        <div className="head head--wide">
          <span className="eyebrow">What FyreCore is</span>
          <h2>A game studio, and the rails its games run on.</h2>
          <p>Four things, in the order they matter. If the first one is not good, none of the rest is worth building.</p>
        </div>
        <div className="offer">
          {offer.map((o, i) => (
            <article className="offer__card reveal" key={o.k} style={{'--i': i}}>
              <div className="offer__glow" aria-hidden="true" />
              <div className="offer__body">
                <span className="offer__k">{o.k}</span>
                <h3>{o.t}</h3>
                <p>{o.d}</p>
                <ul className="chips">{o.a.map(x => <li key={x}>{x}</li>)}</ul>
                <Link href={o.href} className="offer__cta">{o.cta}<i aria-hidden="true">&rarr;</i></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}