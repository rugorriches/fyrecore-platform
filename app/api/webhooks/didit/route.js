import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Didit webhook (destination pinned to webhook_version v3).
 * Verifies X-Signature-V2 (HMAC-SHA256 over Didit's canonical JSON: sorted keys,
 * compact separators, Unicode preserved, whole-valued floats as ints) and falls back
 * to X-Signature (HMAC over the exact raw bytes). Both in constant time; stale
 * timestamps (>5 min) rejected. vendor_data carries our user id.
 */
const MAP = {
  'Not Started': 'pending', 'In Progress': 'pending', 'Awaiting User': 'pending',
  'Resubmitted': 'pending', 'In Review': 'in_review', 'Approved': 'approved',
  'Declined': 'declined', 'Abandoned': 'abandoned', 'Expired': 'expired', 'Kyc Expired': 'expired'
};

function shortenFloats(v) {
  if (Array.isArray(v)) return v.map(shortenFloats);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shortenFloats(x)]));
  if (typeof v === 'number' && !Number.isInteger(v) && v % 1 === 0) return Math.trunc(v);
  return v;
}
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => { o[k] = sortKeys(v[k]); return o; }, {});
  return v;
}
function safeEq(expectedHex, headerHex) {
  const a = Buffer.from(expectedHex, 'utf8'), b = Buffer.from(headerHex ?? '', 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function ageFromDob(dob) {
  if (!dob) return null;
  const d = new Date(dob); if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

export async function POST(req) {
  const secret = process.env.DIDIT_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'not configured' }, { status: 503 });

  const raw = await req.text();
  const ts = Number(req.headers.get('x-timestamp') ?? 0);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) return NextResponse.json({ error: 'stale' }, { status: 401 });

  let body; try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }

  const canonical = JSON.stringify(sortKeys(shortenFloats(body)));
  const v2ok  = safeEq(crypto.createHmac('sha256', secret).update(canonical, 'utf8').digest('hex'), req.headers.get('x-signature-v2'));
  const rawok = !v2ok && safeEq(crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex'), req.headers.get('x-signature'));
  if (!v2ok && !rawok) return NextResponse.json({ error: 'bad signature' }, { status: 401 });

  // Test deliveries from the console carry sample data; acknowledge without touching state.
  if (req.headers.get('x-didit-test-webhook') === 'true') return NextResponse.json({ ok: true, test: true });
  // Only session events carry a user; entity/transaction events are acknowledged and ignored.
  if (body?.webhook_type !== 'status.updated' && body?.webhook_type !== 'data.updated') return NextResponse.json({ ok: true, ignored: body?.webhook_type ?? null });

  const userId = body?.vendor_data;
  if (!userId) return NextResponse.json({ error: 'no vendor_data' }, { status: 400 });
  const status = MAP[body?.status] ?? 'pending';

  // v3 decision: per-feature plural arrays. Keep only age and issuing country; nothing else is stored.
  const dec = body?.decision ?? {};
  const idv = Array.isArray(dec.id_verifications) ? dec.id_verifications.find(x => x?.status === 'Approved') ?? dec.id_verifications[0] : null;
  const age = idv?.age ?? ageFromDob(idv?.date_of_birth) ?? null;
  const country = idv?.issuing_state ?? null;

  const admin = createAdminClient();
  const { error } = await admin.rpc('fn_upsert_verification', {
    p_user: userId, p_status: status, p_session_id: body?.session_id ?? null, p_vendor_status: body?.status ?? null,
    p_dob_verified: status === 'approved' && age != null, p_age: age, p_country: country, p_region: null
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
