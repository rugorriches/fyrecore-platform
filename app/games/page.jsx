import Link from 'next/link';
import { getGames } from '../../lib/data';
import GameCard from '../../components/GameCard';

export const metadata = { title: 'FyreCore Games' };
export const revalidate = 300;

export default async function Games(){
  const games = await getGames('fyrecore');
  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow">FyreCore titles</span>
        <h2>Our games, our rails, any currency.</h2>
        <p>Built and owned by FyreCore. Priced in dollars. Pay with a card, USDC, OMENX or GMT &mdash; the price is the same whichever you choose. No token of ours, no wallet required to play.</p>
      </div>

      <div className="ggrid">{games.map((g, i) => <GameCard g={g} i={i} key={g.slug} />)}</div>

      <div className="split" style={{marginTop:'4rem'}}>
        <div className="split__panel">
          <span className="eyebrow">Ascension, up close</span>
          <h3>An original anime arena fighter</h3>
          <p>Every mesh, shader, particle and sound is generated in code. No external assets. Twenty data-driven characters across rushdown, heavy, speed, zoner, glass, defender and aerial archetypes. Five stages with their own palette and seeded music. Frame-data combat with chains, special cancels, air tech and chip that cannot kill.</p>
          <p>Replays are input-only and deterministic, verified against a state hash. That is the prerequisite for rollback netcode, which is the next thing being built.</p>
          <ul className="chips"><li>20 characters</li><li>5 stages</li><li>60 Hz fixed-step sim</li><li>Deterministic replays</li><li>Browser, no install</li></ul>
          <a className="btn btn--heat" href="https://ascension-peach.vercel.app" target="_blank" rel="noopener">Play the alpha</a>
        </div>
        <div className="split__panel split__panel--dim">
          <span className="eyebrow">Honest limits</span>
          <h3>What it is not, yet</h3>
          <p>Balance is machine-tuned, not human-tuned. There is no online play. Animation is procedural rather than hand-authored. Warfront, Breachpoint and Ashlands are designed and not in production.</p>
          <p>Dates go on this page only when a build exists. Weekly progress is in the <Link href="/dev-log">dev log</Link>.</p>
        </div>
      </div>
    </div></section>
  );
}