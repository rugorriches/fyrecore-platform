import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ status: 'none' });
  const { data } = await supabase.from('verifications').select('status, dob_verified, verified_at').eq('user_id', user.id).maybeSingle();
  return NextResponse.json({ status: data?.status ?? 'none', dobVerified: Boolean(data?.dob_verified), verifiedAt: data?.verified_at ?? null });
}