import Link from 'next/link';

export const metadata = { title: "Founder's Pass" };

export default function Pass(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Founder&rsquo;s Pass</h2><p>Early access and cosmetics across every FyreCore title, bought once. It funds the first game&rsquo;s art and the first season&rsquo;s prize pools.</p></div>
      <div className="note note--warn" style={{marginBottom:'2.5rem'}}><p><strong>What this is not:</strong> it pays no rewards, shares no revenue, and carries no expectation of profit. The contract has no payout function of any kind. If you are looking for a return, this is the wrong product and we would rather say so here than in a footnote.</p></div>
      <div className="tiers">
        <article className="tier"><h3>Spark</h3><div className="tier__price">$39</div><div className="tier__supply">10,000 available</div>
          <ul><li>Early access to Ascension</li><li>One exclusive skin</li><li>1.5&times; Embers</li><li>Founder badge on your Core</li></ul>
          <span className="btn btn--ghost">Opens with the first playable build</span></article>
        <article className="tier tier--lead"><h3>Ember</h3><div className="tier__price">$149</div><div className="tier__supply">1,500 available</div>
          <ul><li>Early access to every FyreCore title</li><li>Exclusive skin set per title</li><li>2&times; Embers</li><li>Marketplace fee cut to 2.5%</li><li>Founder Discord role</li></ul>
          <span className="btn btn--heat">Opens with the first playable build</span></article>
        <article className="tier"><h3>Blaze</h3><div className="tier__price">$499</div><div className="tier__supply">250 available</div>
          <ul><li>Everything in Ember</li><li>Design a cosmetic with the team</li><li>Permanent Founder bracket seat</li><li>3&times; Embers</li><li>Name in the credits of every title</li></ul>
          <span className="btn btn--ghost">Opens with the first playable build</span></article>
      </div>
      <div className="head" style={{marginTop:'4rem'}}><h2>Two rules we set for ourselves</h2></div>
      <div className="flow">
        <div className="flow__row"><span className="flow__key">Play first</span><p>The mint does not open until Ascension is playable in your browser. You should be able to try the game before deciding whether the pass is worth it.</p></div>
        <div className="flow__row"><span className="flow__key">Soulbound</span><p>Passes cannot be transferred for twelve months, enforced in the contract. Flippers get nothing out of the first window and the founding community stays the founding community.</p></div>
      </div>
      <p style={{marginTop:'2.5rem'}}><Link href="/roadmap" className="btn btn--ghost">See what has to ship first</Link></p>
    </div></section>
  );
}