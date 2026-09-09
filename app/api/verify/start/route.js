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

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';
  const res = await fetch('https://verification.didit.me/v2/session/', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({ workflow_id: workflow, vendor_data: user.id, callback: `${site}/verify?done=1` })
  });
  if (!res.ok) return NextResponse.json({ error: 'provider error', detail: await res.text() }, { status: 502 });
  const session = await res.json();

  await admin.rpc('fn_upsert_verification', {
    p_user: user.id, p_status: 'pending', p_session_id: session.session_id, p_vendor_status: 'created'
  });

  return NextResponse.json({ status: 'pending', url: session.url });
}