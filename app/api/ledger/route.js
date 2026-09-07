import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 60;

/** Public economy figures. Same numbers the Phase D gate is judged on. */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ totals: { revenue: 0, buyback: 0, prizes: 0 }, daily: [], seasons: [] });
  }

  const supabase = createClient();
  const [{ data: daily }, { data: flow }] = await Promise.all([
    supabase.from('economy_daily').select('*').limit(90),
    supabase.from('season_flow').select('*')
  ]);

  const totals = (daily ?? []).reduce((a, d) => ({
    revenue: a.revenue + Number(d.revenue_usd ?? 0),
    buyback: a.buyback + Number(d.buyback_usd ?? 0),
    prizes:  a.prizes  + Number(d.prizes_usd  ?? 0)
  }), { revenue: 0, buyback: 0, prizes: 0 });

  return NextResponse.json({ totals, daily: daily ?? [], seasons: flow ?? [] });
}