export const metadata = { title: 'Roadmap' };

const phases = [
  { id:'Phase A', now:true, t:'Platform foundation', d:'Core sign-in with an embedded wallet, the Embers ledger, quests, inventory, the Arena bracket engine, the two-section catalog and the developer portal. Contracts written and deployed to test networks only.' },
  { id:'Phase B', t:'Ascension vertical slice', d:'The fighter is playable in the browser with rollback netcode. The VIP Pass mint opens here and not a day earlier.' },
  { id:'Phase C', t:'Season 0 and the first paid brackets', d:'Soft launch of Ascension. Embers earned by playing. Weekly Ranked brackets with escrowed USDC pools. The public ledger fills with real numbers. Genesis cosmetic sale with fixed supply.' },
  { id:'Phase D', t:'Open the marketplace', d:'Only if Season 0 clears its gates: 30-day retention above 10%, a sink to faucet ratio at or above 1.0, and real bracket revenue. Player-to-player cosmetic trading in USDC, redemption reserve funded, creator publishing opened. There is no token launch in this plan.' },
  { id:'Phase E', t:'Second title and third-party studios', d:'Rift Runner on FyreCore rails, then Warfront or Breachpoint. Third-party studios onboard through the developer portal. OMEN-section titles continue on OMEN in parallel.' }
];

export default function Roadmap(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Roadmap</h2><p>Each phase has to clear the one before it. The Phase D gates are computed from the database rather than asserted, and if Season 0 misses them we fix the game rather than open the marketplace.</p></div>
      {phases.map(p => (
        <div className={`phase${p.now ? ' phase--now' : ''}`} key={p.id}>
          <div className="phase__id">{p.id}{p.now ? ' \u00b7 now' : ''}</div>
          <div><h3>{p.t}</h3><p>{p.d}</p></div>
        </div>
      ))}
      <div className="note" style={{marginTop:'3rem'}}><p>No dates. A two-person studio that publishes dates it cannot hit spends its credibility before it has any. Weekly build notes go in the dev log instead.</p></div>
    </div></section>
  );
}