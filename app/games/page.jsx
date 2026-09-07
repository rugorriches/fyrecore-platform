export const metadata = { title: 'Games' };

export default function Games(){
  return (
    <section className="section"><div className="wrap">
      <div className="head"><h2>Games</h2><p>Every title is first-party. We ship one, prove the platform on it, then build the next. Dates go on this page only when a build exists.</p></div>
      <div className="roster" style={{marginBottom:'3rem'}}>
        <div className="slot"><h3>Ascension</h3><span>Anime arena fighter</span><em>Playable build</em></div>
        <div className="slot"><h3>Warfront</h3><span>Tactical war</span><em>Concept</em></div>
        <div className="slot"><h3>Breachpoint</h3><span>First-person shooter</span><em>Concept</em></div>
        <div className="slot"><h3>Ashlands</h3><span>Open world</span><em>Concept</em></div>
      </div>
      <div className="head"><h2>Ascension</h2><p>An original anime arena fighter. Every mesh, shader, particle and sound is generated in code &mdash; there are no external assets. It runs in a browser with no install.</p></div>
      <div className="tblwrap"><table className="tbl"><tbody>
        <tr><th>Stack</th><td>Vite, TypeScript, Three.js. Custom 60 Hz fixed-timestep simulation, no physics engine.</td></tr>
        <tr><th>Roster</th><td>20 data-driven characters across rushdown, heavy, speed, zoner, glass, defender and aerial archetypes</td></tr>
        <tr><th>Stages</th><td>Five, each with its own shader palette, prop style, lighting, and a seeded music track</td></tr>
        <tr><th>Combat</th><td>Frame-data driven: chains, special cancels, jump-cancel launchers, air tech, damage scaling, chip that cannot kill</td></tr>
        <tr><th>Replays</th><td>Input-only and deterministic, verified against a state hash on playback. This is the prerequisite for rollback netcode.</td></tr>
        <tr><th>Honest limits</th><td>Balance is machine-tuned, not human-tuned. No netcode yet. Animation is procedural rather than hand-authored.</td></tr>
      </tbody></table></div>
      <div className="note" style={{marginTop:'2.5rem'}}><p>Warfront, Breachpoint, and Ashlands are designed but not in production. They exist here so you can see where the Core is going, not as a promise of a release date.</p></div>
    </div></section>
  );
}