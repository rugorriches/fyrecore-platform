export const metadata = { title: 'Roadmap' };

const phases = [
  { id:'Phase A', now:true, t:'Platform foundation', d:'Core sign-in with an embedded wallet, the Embers ledger, quests, inventory, the Arena bracket engine, and the marketplace. Contracts written and deployed to Base Sepolia only.' },
  { id:'Phase B', t:'Ascension vertical slice', d:'The fighter is playable in the browser with rollback netcode. The Founder Pass mint opens here and not a day earlier.' },
  { id:'Phase C', t:'Season 0 and the first paid brackets', d:'Soft launch of Ascension. Embers earned by playing. Weekly Ranked brackets with escrowed USDC pools. The public ledger fills with real numbers. Genesis cosmetic sale with fixed supply.' },
  { id:'Phase D', t:'FYRE, gated', d:'Only if Season 0 clears its gates: 30-day retention above 10%, a sink to faucet ratio at or above 1.0, and real bracket revenue. Two audits published. Distribution by Merkle claim to Embers and pass holders.' },
  { id:'Phase E', t:'Second title and the Studio SDK', d:'Warfront or Breachpoint, funded by platform revenue and grants rather than emissions. Third-party studios onboard to the Core, the Arena, and the Forge.' }
];

export default function Roadmap(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Roadmap</h2><p>Each phase has to clear the one before it. The Phase D gates are computed from the database rather than asserted, and if Season 0 misses them we fix the game rather than launch the token.</p></div>
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