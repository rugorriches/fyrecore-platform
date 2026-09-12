import Link from 'next/link';
import { getGames, getCollections } from '../../lib/data';
import GameCard from '../../components/GameCard';
import CollectionCard from '../../components/CollectionCard';

export const metadata = { title: 'OMEN Games' };
export const revalidate = 300;

export default async function Omen(){
  const [games, cols] = await Promise.all([getGames('omen'), getCollections('omen')]);
  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow eyebrow--omen">OMEN platform titles</span>
        <h2>Built on OMEN. Played by OMEN rules.</h2>
        <p>These titles run on the OMEN Foundation platform on BSC and use its currencies, OMENX and GMT. Items are minted into OMEN&rsquo;s contracts and traded on OMENX. FyreCore is an independent third-party developer here with no ownership stake in OMEN. <b>Last Bastion is live and playable</b>; the rest are previews of what is in development and are not yet playable.</p>
      </div>

      <div className="rules">
        <div className="rules__item"><b>Currency</b><span>OMENX and GMT only, at prices set in the OMEN portal</span></div>
        <div className="rules__item"><b>Contracts</b><span>OMEN&rsquo;s. Supply, metadata and trading are theirs to govern</span></div>
        <div className="rules__item"><b>Prizes</b><span>Open lane: cosmetics and XP. Certified lane: OMENX, geofenced by server-derived region</span></div>
        <div className="rules__item"><b>Economies</b><span>Unconnected to FyreCore titles. Nothing transfers between the two sections</span></div>
      </div>

      <div className="ggrid" style={{marginTop:'2.5rem'}}>{games.map((g, i) => <GameCard g={g} i={i} key={g.slug} />)}</div>

      <div className="head head--wide" style={{marginTop:'4.5rem'}}>
        <span className="eyebrow eyebrow--omen">OMEN-tier items</span>
        <h2>In-game NFTs on OMEN</h2>
        <p>Minted on OMEN contracts, bought with OMENX or GMT, displayed here and on OMENX. Supply limits and trading rules come from OMEN. These grant perks inside the OMEN titles and nowhere else.</p>
      </div>
      <div className="ngrid">{cols.map((c, i) => <CollectionCard c={c} i={i} key={c.slug} />)}</div>

      <div className="note" style={{marginTop:'3rem'}}>
        <p>Why two sections rather than one: OMEN will not whitelist a FyreCore-owned contract on OMENX, so anything sold there must live on their contracts. We build for that where it makes sense and keep our own titles on rails we own. Full reasoning on the <Link href="/economy">economy page</Link>.</p>
      </div>
    </div></section>
  );
}