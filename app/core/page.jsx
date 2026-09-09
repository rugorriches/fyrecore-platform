import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your Core' };

export default async function Core() {
  if (!isSupabaseConfigured()) redirect('/join');

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/join');

  const [{ data: profile }, { data: core }, { data: balances }, { data: quests }, { data: done }, { data: orders }, { data: inv }] =
    await Promise.all([
      supabase.from('profiles').select('handle, founder_tier').eq('id', user.id).single(),
      supabase.from('cores').select('*').eq('user_id', user.id).single(),
      supabase.from('embers_balances').select('season_id, balance'),
      supabase.from('quests').select('*').eq('active', true).order('id'),
      supabase.from('quest_completions').select('quest_id'),
      supabase.from('orders').select('id, state, price_usd_cents, currency, tx_hash, created_at, skus(name, kind)').in('state', ['paid', 'fulfilled']).order('created_at', { ascending: false }).limit(25),
      supabase.from('inventory').select('id, bound, state, item_defs(name, rarity)').order('id', { ascending: false }).limit(50)
    ]);
  const explorer = process.env.NEXT_PUBLIC_CHAIN === 'base' ? 'https://basescan.org/tx/' : 'https://sepolia.basescan.org/tx/';

  const embers = (balances ?? []).reduce((a, b) => a + Number(b.balance), 0);
  const doneIds = new Set((done ?? []).map(d => d.quest_id));
  const threshold = 200;
  const matches = core?.threshold_matches ?? 0;
  const pct = Math.min(100, Math.round((matches / threshold) * 100));

  return (
    <section className="section"><div className="wrap">
      <div className="head">
        <h2>{profile?.handle ?? 'Your Core'}</h2>
        <p>One identity across every FyreCore game. Rating and mastery follow you into each new title.</p>
      </div>

      <dl className="ledger" style={{marginBottom:'2.5rem'}}>
        <div><dt>Rating</dt><dd>{Math.round(core?.rating ?? 1500)}</dd></div>
        <div><dt>Embers</dt><dd className="pos">{embers.toLocaleString()}</dd></div>
        <div><dt>Reviewed matches</dt><dd>{matches}</dd></div>
        <div><dt>Founder tier</dt><dd>{profile?.founder_tier ?? '--'}</dd></div>
      </dl>

      <div className="head"><h2>Resale status</h2>
        <p>Earned cosmetics are yours to use straight away. Reselling them unlocks when this bar fills.</p></div>
      <div className="bar" style={{height:'22px'}}>
        <i style={{animation:'none', transform:`scaleX(${pct/100})`}} />
      </div>
      <p style={{marginTop:'.7rem',fontSize:'.82rem',color:'var(--steel)'}}>
        {matches} of {threshold} reviewed rated matches. Matches count only after review, so grinding a bot farm does not move this bar.
      </p>

      <div className="head" style={{marginTop:'4rem'}}><h2>Quests</h2>
        <p>Embers are earned, never bought. They cannot be traded and they decay at the end of a season.</p></div>
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>Quest</th><th>Reward</th><th>Status</th></tr></thead>
        <tbody>
          {(quests ?? []).map(q => (
            <tr key={q.id}>
              <td><b>{q.title}</b><br /><span style={{color:'var(--steel)'}}>{q.description}</span></td>
              <td>{q.reward_embers.toLocaleString()} Embers</td>
              <td style={{color: doneIds.has(q.id) ? 'var(--jade)' : 'var(--steel)'}}>
                {doneIds.has(q.id) ? 'Complete' : 'Available'}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>

      <div className="head" style={{marginTop:'4rem'}}><h2>Purchases</h2>
        <p>Everything you have bought, each with the on-chain transaction that paid for it.</p></div>
      {(orders ?? []).length ? (
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th>Item</th><th>Paid</th><th>State</th><th>Transaction</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><b>{o.skus?.name ?? `Order ${o.id}`}</b><br /><span style={{color:'var(--steel)'}}>{o.skus?.kind}</span></td>
                <td>${(o.price_usd_cents / 100).toFixed(2)} {String(o.currency).toUpperCase()}</td>
                <td>{o.state}</td>
                <td>{o.tx_hash ? <a href={`${explorer}${o.tx_hash}`} target="_blank" rel="noopener" style={{fontFamily:'monospace'}}>{o.tx_hash.slice(0, 10)}&hellip;</a> : '--'}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      ) : <p style={{color:'var(--steel)'}}>Nothing yet. The <Link href="/store">store</Link> and <Link href="/boxes">boxes</Link> both settle in USDC on Base.</p>}

      <div className="head" style={{marginTop:'4rem'}}><h2>Inventory</h2>
        <p>Items marked bound came from boxes and can never be sold or redeemed. Everything else can.</p></div>
      {(inv ?? []).length ? (
        <ul className="chips">{inv.map(x => <li key={x.id}>{x.item_defs?.name ?? 'Item'} &middot; {x.item_defs?.rarity}{x.bound ? ' · bound' : ''}</li>)}</ul>
      ) : <p style={{color:'var(--steel)'}}>Empty.</p>}

      <p style={{marginTop:'2.5rem'}}>
        <Link href="/ledger" className="btn btn--ghost">See the platform books</Link>
      </p>
    </div></section>
  );
}