import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 300;

/** Public catalog: boxes, published odds, pool sizes by rarity, rarity palette. */
export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ boxes: [], rarities: [] });
  const s = createClient();
  const [{ data: boxes }, { data: odds }, { data: pool }, { data: rarities }] = await Promise.all([
    s.from('box_defs').select('*').eq('active', true).order('price_usd_cents'),
    s.from('box_odds').select('box_id, rarity, weight_bps'),
    s.from('box_pool').select('box_id, item_defs(rarity)'),
    s.from('rarities').select('*').order('rank')
  ]);
  const out = (boxes ?? []).map(b => ({
    ...b,
    odds: (odds ?? []).filter(o => o.box_id === b.id).map(o => ({ rarity: o.rarity, pct: o.weight_bps / 100 })),
    pool: (pool ?? []).filter(p => p.box_id === b.id).reduce((a, p) => { const k = p.item_defs?.rarity; if (k) a[k] = (a[k] ?? 0) + 1; return a; }, {})
  }));
  return NextResponse.json({ boxes: out, rarities: rarities ?? [] });
}