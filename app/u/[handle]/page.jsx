import { notFound } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) { return { title: `@${params.handle}` }; }

const TIER = { founder:'VIP', early:'Early access' };

/** Public player page. Reads only the public_profiles view: never email, never wallet. */
export default async function PublicProfile({ params }) {
  if (!isSupabaseConfigured()) notFound();
  const s = createClient();
  const { data: p } = await s.from('public_profiles').select('*').eq('handle', String(params.handle).toLowerCase()).maybeSingle();
  if (!p) notFound();
  const { data: inv } = await s.from('inventory').select('id, item_defs(name, rarity)').eq('user_id', p.id).limit(24);

  return (
    <section className="section"><div className="wrap" style={{maxWidth:'48rem'}}>
      <div className="head">
        <span className="eyebrow">Player</span>
        <h2>{p.display_name ?? `@${p.handle}`} <span style={{color:'var(--steel)', fontSize:'.6em', fontWeight:400}}>@{p.handle}</span></h2>
        {p.bio && <p>{p.bio}</p>}
        <ul className="chips">
          {p.verified && <li>Verified</li>}
          {p.founder_tier && <li>{TIER[p.founder_tier] ?? p.founder_tier}</li>}
          {p.country && <li>{p.country}</li>}
          <li>Since {new Date(p.created_at).toLocaleDateString(undefined, { month:'short', year:'numeric' })}</li>
        </ul>
      </div>
      <div className="ngrid" style={{marginTop:'2rem'}}>
        <div className="hud" style={{padding:'1.2rem'}}><span className="eyebrow">Rating</span><h3 style={{margin:'.3rem 0 0'}}>{Math.round(Number(p.rating))}</h3></div>
        <div className="hud" style={{padding:'1.2rem'}}><span className="eyebrow">Mastery</span><h3 style={{margin:'.3rem 0 0'}}>Level {p.mastery_level}</h3></div>
        <div className="hud" style={{padding:'1.2rem'}}><span className="eyebrow">Rated matches</span><h3 style={{margin:'.3rem 0 0'}}>{p.rated_matches}</h3></div>
      </div>
      <div className="head" style={{marginTop:'3rem'}}><h2 style={{fontSize:'var(--s2)'}}>Cosmetics</h2></div>
      {(inv ?? []).length ? <ul className="chips">{inv.map(x => <li key={x.id}>{x.item_defs?.name ?? 'Item'} · {x.item_defs?.rarity}</li>)}</ul> : <p style={{color:'var(--steel)'}}>None shown.</p>}
    </div></section>
  );
}
