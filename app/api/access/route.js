import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { checkAccess } from '../../../lib/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/access?feature=random_boxes -> { allowed, reason, needs_verification, min_age, country, region } */
export async function GET(req) {
  const feature = new URL(req.url).searchParams.get('feature');
  const ok = ['random_boxes','paid_brackets','high_stakes','marketplace'];
  if (!ok.includes(feature)) return NextResponse.json({ error: 'unknown feature' }, { status: 400 });
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ allowed: false, reason: 'not signed in', needs_verification: false }, { status: 401 });
  return NextResponse.json(await checkAccess(user.id, feature));
}