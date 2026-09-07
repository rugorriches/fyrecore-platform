export const metadata = { title: 'FAQ' };

const qa = [
  ['Can I make money playing this?','Almost certainly not, and we are not going to imply otherwise. Paid brackets pay out the entry fees minus a rake, so the money comes from other entrants rather than from us. Most people who enter a competitive bracket lose it. Treat everything here as a game you pay to play, not a way to earn.'],
  ['Do I need to know anything about crypto?','No. You sign in with an email, a wallet is created for you in the background, and you will never see a seed phrase or pay a gas fee. If you never want to touch the token side, the games work fine without it.'],
  ['What are Embers and why can I not sell them?','Embers are what you earn by playing. They cannot be bought, sold, or transferred, and they decay at the end of each season. That is deliberate: nearly every game economy that collapsed did so because it paid rewards in a token people could immediately sell. Keeping the reward currency non-tradable is what stops that.'],
  ['When does FYRE launch?','There is no date and there may never be one. The token only ships if the first game clears its gates: 30-day retention above 10%, a sink to faucet ratio at or above 1.0, and real bracket revenue. Those numbers are published on the ledger page as they accumulate. If Ascension misses them we fix the game instead of launching a token.'],
  ['Can I buy FYRE now?','No. There is no presale, no private round, and no allocation for sale. If you see anyone selling FYRE, it is a scam.'],
  ['Why does my FYRE start locked?','Every balance starts locked and fully spendable inside the platform. It becomes transferable for your account once you cross the play threshold. This is what stops bot farms and airdrop hunters from extracting value, and it applies to us too: the team tokens are under the same lock.'],
  ['Could you freeze my tokens or raise the bar after I start?','No to both, and it is enforced in the contract rather than promised. Unlocking is one-way with no re-lock function, and the threshold setter reverts on any value higher than the current one. It can only ever be lowered.'],
  ['What counts toward the threshold?','Reviewed rated matches only. Results arrive from the game server signed, land as pending, and count only after review. Grinding a private bot farm moves nothing, which is the entire reason the mechanic is worth anything.'],
  ['What is the Vault actually for?','It gives every item and the token a redemption value you can check. You can burn FYRE for a defined item pack, or burn the pack back into FYRE minus a fee. The FYRE you paid stays in the vault as reserve, so the backing for that redemption is sitting on-chain rather than being a promise.'],
  ['Are the item packs loot boxes?','No. Pack contents are fixed and published, so you know exactly what you get before you spend. A random-contents pack bought with a token is a loot box, and loot boxes carry real gambling exposure in several US states. We would rather not build that at all.'],
  ['What happens to my entry fee if a tournament never finishes?','You take it back yourself. Entry fees sit in an escrow contract with a refund deadline, and if a bracket is cancelled or we simply never settle it, you claim directly from the contract without needing us to cooperate.'],
  ['Is the Founder Pass an investment?','No. It grants early access and cosmetics and nothing else. The contract contains no payout function and none will be added, it pays no rewards and no revenue share, and it is non-transferable for twelve months. If it appeals to you only as something to flip, it is the wrong purchase.'],
  ['Who is building this?','Two people. That is the single biggest risk here, and it is why the roadmap has no dates on it. Progress goes in the dev log every week, including the weeks where something broke.'],
  ['What happens if you run out of money or quit?','The passes would lose most of their practical value and the games would stop being developed. We would rather write that sentence here than bury it. Nothing in the design assumes you will be made whole if the studio fails.'],
  ['Is any of this audited?','Not yet. The contracts are written and compile clean, and they are deployed to a test network only. Two independent audits have to be published before anything touches mainnet, and an audit still is not a guarantee.']
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