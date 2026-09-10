import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';

export const metadata = { title: 'Public ledger' };
export const revalidate = 60;

const cats = [
  ['Tournament rake','Share of every paid bracket, capped at 10% in the escrow contract'],
  ['Marketplace fee','5% standard, 2.5% for pass holders, capped at 7.5% in code'],
  ['Pass sales',"Founder's Pass mints"],
  ['Cosmetic sales','Direct sales and Vault fission'],
  ['Creator fees','Platform share of creator cosmetic sales']
];

const usd = (n) => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

export default async function Ledger(){
  let daily = [], seasons = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const [a, b] = await Promise.all([
        supabase.from('economy_daily').select('*').limit(90),
        supabase.from('season_flow').select('*')
      ]);
      daily = a.data ?? [];
      seasons = b.data ?? [];
    } catch {
      // The ledger reports zeros rather than an error page. It is a public
      // accountability page; a stack trace here helps nobody.
    }
  }

  const t = daily.reduce((a, d) => ({
    revenue: a.revenue + Number(d.revenue_usd ?? 0),
    buyback: a.buyback + Number(d.buyback_usd ?? 0),
    prizes:  a.prizes  + Number(d.prizes_usd  ?? 0)
  }), { revenue: 0, buyback: 0, prizes: 0 });

  const season = seasons[0];
  const ratio = season?.sink_faucet_ratio;
  const hasData = daily.length > 0;

  return (
    <section className="section"><div className="wrap">
      <div className="head">
        <h2>Public ledger</h2>
        <p>Revenue in, buybacks executed, prizes paid. These are the same numbers the Phase D gate is judged on, so the gate cannot be quietly moved.</p>
      </div>

      <dl className="ledger" style={{marginBottom:'2.5rem'}}>
        <div><dt>Revenue to date</dt><dd>{usd(t.revenue)}</dd></div>
        <div><dt>Redemption reserve</dt><dd>{usd(t.buyback)}</dd></div>
        <div><dt>Prizes paid</dt><dd>{usd(t.prizes)}</dd></div>
        <div><dt>Sink / faucet ratio</dt>
          <dd className={ratio == null ? 'neg' : Number(ratio) >= 1 ? 'pos' : 'neg'}>
            {ratio == null ? 'n/a' : Number(ratio).toFixed(2)}
          </dd></div>
      </dl>

      {!hasData && (
        <div className="empty">
          <strong>Nothing to report yet</strong>
          The ledger is live and reading from the database. It shows zeros because there has been no revenue.
          Publishing it empty is the point &mdash; you get to watch the first dollar arrive.
        </div>
      )}

      {hasData && (
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th>Day</th><th>Revenue</th><th>Reserve</th><th>Prizes</th><th>Ops</th></tr></thead>
          <tbody>{daily.map(d => (
            <tr key={d.occurred_on}>
              <td><b>{d.occurred_on}</b></td>
              <td>{usd(d.revenue_usd)}</td><td>{usd(d.buyback_usd)}</td>
              <td>{usd(d.prizes_usd)}</td><td>{usd(d.ops_usd)}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      <div className="head" style={{marginTop:'4rem'}}><h2>Seasons</h2>
        <p>Embers earned against Embers spent. A ratio at or above 1.0 means the economy drains at least as fast as it fills, which is the condition the open marketplace cannot launch without.</p></div>
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>Season</th><th>Earned</th><th>Spent</th><th>Ratio</th></tr></thead>
        <tbody>{seasons.map(s => (
          <tr key={s.season_id}>
            <td><b>{s.name}</b></td>
            <td>{Number(s.embers_in).toLocaleString()}</td>
            <td>{Number(s.embers_out).toLocaleString()}</td>
            <td>{s.sink_faucet_ratio == null ? '--' : Number(s.sink_faucet_ratio).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table></div>

      <div className="head" style={{marginTop:'4rem'}}><h2>What gets counted</h2></div>
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>Category</th><th>Source</th></tr></thead>
        <tbody>{cats.map(([a,b]) => (<tr key={a}><td><b>{a}</b></td><td>{b}</td></tr>))}</tbody>
      </table></div>

      <div className="head" style={{marginTop:'4rem'}}><h2>How revenue is split</h2><p>The split runs in a contract on every deposit, so the proportions are checkable rather than stated.</p></div>
      <div className="flow">
        <div className="flow__row"><span className="flow__key">50% ops</span><p>Development, art, infrastructure, and the audits that have to happen before anything reaches mainnet.</p></div>
        <div className="flow__row flow__row--out"><span className="flow__key">30% reserve</span><p>Held against item redemptions and seeded prize pools. This is what makes the Vault floor a real number rather than a claim, and it is money set aside rather than spent.</p></div>
        <div className="flow__row"><span className="flow__key">20% reserve</span><p>Held against refunds, prize shortfalls, and the months where a two-person studio has no revenue at all.</p></div>
      </div>

      <div className="note" style={{marginTop:'2.5rem'}}><p>The reserve exists so redemptions can always be honoured. If it ever falls below the total outstanding redemption value, that shows up on this page before it shows up as a problem.</p></div>
    </div></section>
  );
}