import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { verifyMessage } from 'viem';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';
const loginMessage = (address, nonce) =>
  `FyreCore sign-in\n\nSigning this signs you in to the FyreCore Core this wallet is linked to. It costs nothing and sends no transaction.\n\nWallet: ${address}\nSite: ${SITE()}\nNonce: ${nonce}`;

/**
 * Step 1 — GET ?address=0x..  : is this wallet linked to a Core with an email? If so, issue a nonce + message.
 * Step 2 — POST {address, signature}: verify, then mint a session for that Core (admin magic-link token consumed
 * server-side, no email sent). A wallet can only ever sign in to the Core it was linked to while signed in.
 */
export async function GET(req) {
  const address = String(new URL(req.url).searchParams.get('address') ?? '').toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(address)) return NextResponse.json({ error: 'bad address' }, { status: 400 });
  const admin = createAdminClient();
  const { data: rows } = await admin.rpc('fn_core_for_wallet', { p_wallet: address });
  const core = rows?.[0];
  if (!core || !core.has_email) return NextResponse.json({ linked: false });
  const nonce = crypto.randomBytes(16).toString('hex');
  await admin.from('wallet_login_nonces').upsert({ address, nonce, expires_at: new Date(Date.now() + 300_000).toISOString() });
  return NextResponse.json({ linked: true, message: loginMessage(address, nonce) });
}

export async function POST(req) {
  let b; try { b = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const address = String(b?.address ?? '').toLowerCase(); const signature = String(b?.signature ?? '');
  if (!/^0x[0-9a-f]{40}$/.test(address) || !/^0x[0-9a-fA-F]+$/.test(signature)) return NextResponse.json({ error: 'address and signature required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: n } = await admin.from('wallet_login_nonces').select('nonce, expires_at').eq('address', address).maybeSingle();
  if (!n || new Date(n.expires_at) < new Date()) return NextResponse.json({ error: 'sign-in request expired — try again' }, { status: 400 });
  await admin.from('wallet_login_nonces').delete().eq('address', address);   // single use

  const ok = await verifyMessage({ address, message: loginMessage(address, n.nonce), signature }).catch(() => false);
  if (!ok) return NextResponse.json({ error: 'signature does not match' }, { status: 401 });

  const { data: rows } = await admin.rpc('fn_core_for_wallet', { p_wallet: address });
  const core = rows?.[0];
  if (!core?.has_email) return NextResponse.json({ error: 'wallet is not linked to an email account' }, { status: 404 });
  const { data: u } = await admin.auth.admin.getUserById(core.user_id);
  const email = u?.user?.email;
  if (!email) return NextResponse.json({ error: 'account has no email' }, { status: 404 });

  // Mint a session: generate a magic-link token for this user and consume it here. Nothing is emailed.
  const { data: link, error: le } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  const tokenHash = link?.properties?.hashed_token;
  if (le || !tokenHash) return NextResponse.json({ error: le?.message ?? 'could not start session' }, { status: 500 });
  const supabase = createClient();
  const { error: ve } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' });
  if (ve) return NextResponse.json({ error: ve.message }, { status: 500 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  await admin.rpc('fn_record_auth_event', { p_user: core.user_id, p_event: 'sign_in', p_method: b?.method === 'walletconnect' ? 'walletconnect' : 'wallet', p_ip: ip, p_ua: req.headers.get('user-agent') ?? null });
  return NextResponse.json({ ok: true });
}
