import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';

export const metadata = { title: 'Developer portal' };
export const dynamic = 'force-dynamic';

const steps = [
  ['Register a studio','One row. Studio name, website, KYC status. Approval gates publishing, not building.'],
  ['Create an app','You get a client ID. There is no client secret and there never will be: auth is PKCE only, so nothing can leak.'],
  ['Register redirect URIs','Exact-match, per environment. Production and localhost are separate entries.'],
  ['Configure SKUs','Every item priced in USD cents. Set which currencies your title accepts; the price is the same in all of them.'],
  ['Choose a lane','Open: cosmetic prizes, no geofence. Certified: USDC prizes, region checked at the edge, never self-declared.'],
  ['Rotate a server key','Hashed at rest, shown once, revocable. Your game server signs match reports with it.']
];

export default async function Dev(){
  let dev = null, apps = [];
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [{ data: d }, { data: a }] = await Promise.all([
        supabase.from('developers').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('developer_apps').select('*, games(name, slug, section)').eq('developer_id', user.id).order('id')
      ]);
      dev = d; apps = a ?? [];
    }
  }

  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow">Developer portal</span>
        <h2>Ship on FyreCore rails.</h2>
        <p>The same portal we use for our own titles. Modelled on the OMEN developer portal, with the parts that hurt us fixed: every save is verified back to you, and there is no client secret to lose.</p>
      </div>

      {dev ? (
        <>
          <dl className="ledger" style={{marginBottom:'2.5rem'}}>
            <div><dt>Studio</dt><dd style={{fontSize:'var(--s2)'}}>{dev.studio_name}</dd></div>
            <div><dt>KYC</dt><dd className={dev.kyc_status==='verified'?'pos':'neg'} style={{fontSize:'var(--s2)'}}>{dev.kyc_status}</dd></div>
            <div><dt>Publishing</dt><dd className={dev.approved?'pos':'neg'} style={{fontSize:'var(--s2)'}}>{dev.approved?'Approved':'Pending'}</dd></div>
            <div><dt>Apps</dt><dd style={{fontSize:'var(--s2)'}}>{apps.length}</dd></div>
          </dl>
          <div className="head"><h2>Apps</h2></div>
          {apps.length === 0 && <div className="empty"><strong>No apps yet</strong>Create one to get a client ID and start registering redirect URIs.</div>}
          {apps.length > 0 && (
            <div className="tblwrap"><table className="tbl">
              <thead><tr><th>App</th><th>Game</th><th>Client ID</th><th>Lane</th><th>Marketplace</th><th>Mint</th></tr></thead>
              <tbody>{apps.map(a => (
                <tr key={a.id}>
                  <td><b>{a.name}</b></td>
                  <td>{a.games?.name ?? '--'}<br/><span style={{color:'var(--steel)'}}>{a.games?.section}</span></td>
                  <td><code style={{fontSize:'.78rem'}}>{a.client_id}</code></td>
                  <td>{a.lane}</td>
                  <td style={{color:a.marketplace_enabled?'var(--jade)':'var(--steel)'}}>{a.marketplace_enabled?'On':'Off'}</td>
                  <td style={{color:a.mint_enabled?'var(--jade)':'var(--steel)'}}>{a.mint_enabled?'On':'Off'}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </>
      ) : (
        <div className="empty" style={{marginBottom:'3rem'}}>
          <strong>Sign in to open the portal</strong>
          <Link href="/join" className="btn btn--heat" style={{marginTop:'1rem'}}>Create your Core</Link>
        </div>
      )}

      <div className="head head--wide" style={{marginTop:'4rem'}}><h2>How publishing works</h2></div>
      <div className="steps">
        {steps.map(([t, d], i) => (
          <div className="step reveal" key={t} style={{'--i': i}}>
            <span className="step__n">{String(i+1).padStart(2,'0')}</span>
            <div><h3>{t}</h3><p>{d}</p></div>
          </div>
        ))}
      </div>

      <div className="split" style={{marginTop:'4rem'}}>
        <div className="split__panel">
          <span className="eyebrow">What the API gives you</span>
          <ul className="rulelist">
            <li><code>POST /api/matches/report</code> &mdash; signed match results from your server</li>
            <li><code>POST /api/quests/complete</code> &mdash; award Embers, server-verified</li>
            <li><code>GET /api/embers</code> &mdash; a signed-in player&rsquo;s balance</li>
            <li><code>GET /api/ledger</code> &mdash; public economy figures</li>
            <li>OAuth PKCE for identity and inventory scopes</li>
          </ul>
        </div>
        <div className="split__panel split__panel--dim">
          <span className="eyebrow">What it will not give you</span>
          <ul className="rulelist">
            <li>A client secret. PKCE only.</li>
            <li>A way to award USDC from a client. Prize money moves through escrow.</li>
            <li>A self-declared region. Certified-lane eligibility is decided at the edge.</li>
            <li>A silent save. Every configuration write returns what was actually persisted.</li>
          </ul>
        </div>
      </div>
    </div></section>
  );
}