import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import BoxStore from '../../components/BoxStore';

export const metadata = { title: 'Boxes' };
export const dynamic = 'force-dynamic';

export default async function Boxes({ searchParams }) {
  let boxes = [], rarities = [], openingFromUrl = null;
  if (isSupabaseConfigured()) {
    const s = createClient();
    const [{ data: b }, { data: o }, { data: p }, { data: r }] = await Promise.all([
      s.from('box_defs').select('*').eq('active', true).order('price_usd_cents'),
      s.from('box_odds').select('box_id, rarity, weight_bps'),
      s.from('box_pool').select('box_id, item_defs(rarity)'),
      s.from('rarities').select('*').order('rank')
    ]);
    rarities = r ?? [];
    boxes = (b ?? []).map(x => ({ ...x,
      odds: (o ?? []).filter(y => y.box_id === x.id).map(y => ({ rarity: y.rarity, pct: y.weight_bps / 100 })),
      pool: (p ?? []).filter(y => y.box_id === x.id).reduce((a, y) => { const k = y.item_defs?.rarity; if (k) a[k] = (a[k] ?? 0) + 1; return a; }, {})
    }));
    const oid = Number(searchParams?.opening);
    if (oid) {
      const { data: { user } } = await s.auth.getUser();
      if (user) { const { data: op } = await createAdminClient().from('box_openings').select('id, box_id, opened_at').eq('id', oid).eq('user_id', user.id).maybeSingle(); if (op && !op.opened_at) openingFromUrl = { id: op.id, boxId: op.box_id }; }
    }
  }

  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow">Boxes</span>
        <h2>Ten boxes. Cosmetic only. Odds on the box.</h2>
        <p>Random boxes drop cosmetic items only. Items from boxes are bound to your account and can never be sold or redeemed. Odds are published per box. 18+, verified. Not available in Belgium or the Netherlands.</p>
      </div>
      {boxes.length ? <BoxStore boxes={boxes} rarities={rarities} openingFromUrl={openingFromUrl} /> : <div className="empty"><strong>Boxes are not live on this deployment</strong>The catalog loads once the platform is connected.</div>}
      <div className="note note--warn" style={{marginTop:'3rem'}}>
        <p><strong>Nothing from a box can be turned back into money.</strong> Items you <em>can</em> sell or redeem never come from boxes — they come from fixed packs where you know the contents before you pay. Duplicates convert to Embers, which have no market. If your region&rsquo;s law changes, the boxes turn off there.</p>
      </div>
    </div></section>
  );
}