import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The signed-in user's Embers balance and recent ledger. RLS scopes it to them. */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  const [{ data: balances }, { data: ledger }] = await Promise.all([
    supabase.from('embers_balances').select('season_id, balance'),
    supabase.from('embers_ledger').select('delta, reason, created_at')
      .order('created_at', { ascending: false }).limit(50)
  ]);

  return NextResponse.json({ balances: balances ?? [], ledger: ledger ?? [] });
}