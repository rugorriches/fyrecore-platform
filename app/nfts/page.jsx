import Link from 'next/link';
import { getCollections } from '../../lib/data';
import CollectionCard from '../../components/CollectionCard';

export const metadata = { title: 'NFTs' };
export const revalidate = 300;

export default async function NFTs(){
  const [fc, omen] = await Promise.all([getCollections('fyrecore'), getCollections('omen')]);
  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow">Collections</span>
        <h2>Two tiers. One storefront.</h2>
        <p>FyreCore-tier collections live on contracts we own, priced in dollars, paid in whatever you have. OMEN-tier collections live on OMEN&rsquo;s contracts under OMEN&rsquo;s rules. Both are shown here; only one is ours.</p>
      </div>

      <div className="tiers2">
        <div className="tiers2__col">
          <span className="eyebrow">FyreCore tier</span>
          <ul className="rulelist">
            <li>Our contracts on Base. We set supply, metadata and royalties.</li>
            <li>Priced in USD from a few dollars to four figures. Pay by card, USDC, OMENX or GMT at the live rate.</li>
            <li>Cosmetic and access only. No yield, no revenue share, no rewards.</li>
            <li>Fixed pack contents. Random boxes exist separately and their drops are bound, never sellable.</li>
            <li>Redeemable through the Vault at a published USD floor.</li>
          </ul>
        </div>
        <div className="tiers2__col tiers2__col--omen">
          <span className="eyebrow eyebrow--omen">OMEN tier</span>
          <ul className="rulelist">
            <li>OMEN&rsquo;s contracts on BSC. Supply and rules are theirs.</li>
            <li>Priced and traded in OMENX and GMT on OMENX.</li>
            <li>In-game perks inside OMEN titles only.</li>
            <li>Displayed here for convenience; purchased through OMEN rails.</li>
            <li>Not owned by FyreCore, and not portable if the relationship ends.</li>
          </ul>
        </div>
      </div>

      <div className="head head--wide" style={{marginTop:'4rem'}}><h2>FyreCore collections</h2></div>
      <div className="ngrid">{fc.map((c, i) => <CollectionCard c={c} i={i} key={c.slug} />)}</div>

      <div className="head head--wide" style={{marginTop:'4rem'}}><h2>OMEN collections</h2></div>
      <div className="ngrid">{omen.map((c, i) => <CollectionCard c={c} i={i} key={c.slug} />)}</div>

      <div className="note note--warn" style={{marginTop:'3rem'}}>
        <p><strong>None of these are investments.</strong> They are cosmetics, access, and in-game perks. If any collection is described to you as paying rewards or appreciating, that description did not come from us.</p>
      </div>
    </div></section>
  );
}