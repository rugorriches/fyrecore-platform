import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Didit webhook. Verifies X-Signature-V2 (HMAC-SHA256 of the raw body with the
 * webhook secret) in constant time, rejects stale timestamps, then upserts.
 * vendor_data carries our user id, set when the session was created.
 */
const MAP = {
  'Not Started': 'pending', 'In Progress': 'pending', 'In Review': 'in_review',
  'Approved': 'approved', 'Declined': 'declined', 'Abandoned': 'abandoned', 'Expired': 'expired'
};

export async function POST(req) {
  const secret = process.env.DIDIT_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'not configured' }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get('x-signature-v2') ?? '';
  const ts  = Number(req.headers.get('x-timestamp') ?? 0);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) return NextResponse.json({ error: 'stale' }, { status: 401 });

  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return NextResponse.json({ error: 'bad signature' }, { status: 401 });

  let body; try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const userId = body?.vendor_data;
  const status = MAP[body?.status] ?? 'pending';
  if (!userId) return NextResponse.json({ error: 'no vendor_data' }, { status: 400 });

  // Age and country from the decision payload when present; never stored beyond these fields.
  const dec = body?.decision ?? {};
  const age = dec?.age ?? dec?.id_verification?.age ?? null;
  const country = dec?.id_verification?.issuing_state ?? dec?.country ?? null;

  const admin = createAdminClient();
  const { error } = await admin.rpc('fn_upsert_verification', {
    p_user: userId, p_status: status, p_session_id: body?.session_id ?? null, p_vendor_status: body?.status ?? null,
    p_dob_verified: status === 'approved' && age != null, p_age: age, p_country: country, p_region: null
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}