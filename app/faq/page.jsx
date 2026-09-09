export const metadata = { title: 'FAQ' };

const qa = [
  ['Can I make money playing this?','Almost certainly not, and we are not going to imply otherwise. Paid brackets pay out the entry fees minus a rake, so the money comes from other entrants rather than from us. Most people who enter a competitive bracket lose it. Treat everything here as a game you pay to play, not a way to earn.'],
  ['Is there a FyreCore token?','No, and there is not going to be one. We designed one in detail, published the design, and then cut it. Roughly 93% of web3 game projects are dead and of forty-one token sales since 2025 only six are profitable, while the platforms underneath kept earning fees. Prize money is paid in USDC and passes are bought with a card.'],
  ['Someone is selling a FYRE token. Is that you?','No. It is a scam and you should not buy it. We have never sold a token, there was never a presale, and there is no allocation of anything in existence.'],
  ['Do I need to know anything about crypto?','No, and increasingly not at all. There is no FyreCore token. You sign in with an email, pay with a card, and never see a seed phrase or a gas fee. Prize money is paid in USDC, which is a dollar stablecoin, and you can cash it out or ignore it.'],
  ['What is the difference between the FyreCore and OMEN sections?','FyreCore titles run on rails we own, are priced in dollars, and accept card, USDC, OMENX or GMT at the same price. OMEN titles run on the OMEN platform in OMENX and GMT under OMEN rules, with items on OMEN contracts. We are an independent third-party developer there with no ownership stake. The two economies are unconnected.'],
  ['Why can I pay with OMENX or GMT for a FyreCore item?','Because a lot of our community already holds them. The price is set in dollars and converted at the live rate when you check out, so the item costs the same in every currency. What we do not do is price anything in a token we do not control.'],
  ['What are Embers and why can I not sell them?','Embers are what you earn by playing. They cannot be bought, sold, or transferred, and they decay at the end of each season. That is deliberate: nearly every game economy that collapsed did so because it paid rewards in something people could immediately sell.'],
  ['Why can I not resell a cosmetic straight away?','Cosmetics you earn are usable immediately, but reselling unlocks once you cross the play threshold. This is what stops bot farms from strip-mining the marketplace, and it applies to us too. It is one-way and the bar can only ever be lowered.'],
  ['What counts toward the threshold?','Reviewed rated matches only. Results arrive from the game server signed, land as pending, and count only after review. Grinding a private bot farm moves nothing, which is the entire reason the mechanic is worth anything.'],
  ['What is the Vault actually for?','It gives every item a redemption value in dollars that you can check before you buy. Packs have fixed published contents at a fixed price, and you can return the items for USDC minus a fee. The reserve behind those redemptions is held rather than spent, so the floor is a real number and not a promise.'],
  ['Are the item packs loot boxes?','No. Pack contents are fixed and published, so you know exactly what you get before you spend. A random-contents pack bought with a token is a loot box, and loot boxes carry real gambling exposure in several US states. We would rather not build that at all.'],
  ['What happens to my entry fee if a tournament never finishes?','You take it back yourself. Entry fees sit in an escrow contract with a refund deadline, and if a bracket is cancelled or we simply never settle it, you claim directly from the contract without needing us to cooperate.'],
  ['Is the Founder Pass an investment?','No. It grants early access and cosmetics and nothing else. The contract contains no payout function and none will be added, it pays no rewards and no revenue share, and it is non-transferable for twelve months. If it appeals to you only as something to flip, it is the wrong purchase.'],
  ['Who is building this?','Two people. That is the single biggest risk here, and it is why the roadmap has no dates on it. Progress goes in the dev log every week, including the weeks where something broke.'],
  ['What happens if you run out of money or quit?','The passes would lose most of their practical value and the games would stop being developed. We would rather write that sentence here than bury it. Nothing in the design assumes you will be made whole if the studio fails.'],
  ['Is any of this audited?','The escrow, marketplace and checkout contracts are written and compile clean, and run on a test network only. They get audited before they hold real money. Cutting the token removed most of what would have needed auditing in the first place, which was part of the reason for cutting it.']
];

export default function FAQ(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Questions</h2><p>Including the ones with answers you might not want. If something here is unclear or reads like a dodge, that is worth telling us about.</p></div>
      <div className="qa">
        {qa.map(([q,a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
      </div>
    </div></section>
  );
}