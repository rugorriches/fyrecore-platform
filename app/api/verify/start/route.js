import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Start a Didit verification session. Same flow Last Bastion used:
 * create session -> store pending -> send the player to Didit's hosted URL.
 * Idempotent: an existing pending/approved session is returned, not duplicated.
 */
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  const apiKey = process.env.DIDIT_API_KEY;
  const workflow = process.env.DIDIT_WORKFLOW_ID;
  if (!apiKey || !workflow) return NextResponse.json({ error: 'verification not configured' }, { status: 503 });

  const admin = createAdminClient();
  const { data: existing } = await admin.from('verifications').select('status, session_id').eq('user_id', user.id).maybeSingle();
  if (existing?.status === 'approved') return NextResponse.json({ status: 'approved' });

  // Each session costs money at the provider. Cap new sessions platform-wide so a bot burst is bounded (~$35/h at 60).
  const { count: recent } = await admin.from('verifications').select('user_id', { count: 'exact', head: true }).gte('updated_at', new Date(Date.now() - 3_600_000).toISOString());
  if (!existing?.session_id && (recent ?? 0) >= 60) return NextResponse.json({ error: 'verification is busy right now — try again in an hour' }, { status: 503 });

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';
  // v3 Sessions API. Idempotent server-side: one unfinished session per (workflow_id, vendor_data).
  const res = await fetch('https://verification.didit.me/v3/session/', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({ workflow_id: workflow, vendor_data: user.id, callback: `${site}/verify?done=1`, callback_method: 'both' })
  });
  if (!res.ok) return NextResponse.json({ error: 'provider error', detail: await res.text() }, { status: 502 });
  const session = await res.json();

  await admin.rpc('fn_upsert_verification', {
    p_user: user.id, p_status: 'pending', p_session_id: session.session_id, p_vendor_status: 'created'
  });

  return NextResponse.json({ status: 'pending', url: session.url });
}