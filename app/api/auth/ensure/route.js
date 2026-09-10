import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Called right after any sign-in. The DB trigger already created profile + core on the auth row;
 * this records the sign-in event and, for wallet sign-ins, guarantees the payout wallet is set.
 * The wallet is only accepted if Supabase's own web3 identity carries the same address.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body = {}; try { body = await req.json(); } catch {}
  const method = ['email', 'wallet', 'walletconnect'].includes(body?.method) ? body.method : null;
  const admin = createAdminClient();
  // Repair path: the auth trigger normally creates these, but never block a signed-in user on a missing row.
  await admin.from('profiles').upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });
  await admin.from('cores').upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true });

  const web3 = (user.identities ?? []).find(i => i.provider === 'web3');
  const idAddr = web3 ? (JSON.stringify(web3.identity_data ?? {}).match(/0x[0-9a-fA-F]{40}/) ?? [])[0]?.toLowerCase() : null;
  const claimed = typeof body?.wallet === 'string' ? body.wallet.toLowerCase() : null;
  if (idAddr && claimed && claimed === idAddr) {
    const { data: p } = await admin.from('profiles').select('wallet_address').eq('id', user.id).maybeSingle();
    if (!p?.wallet_address) await admin.rpc('fn_link_wallet', { p_user: user.id, p_wallet: idAddr });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  await admin.rpc('fn_record_auth_event', { p_user: user.id, p_event: 'sign_in', p_method: method, p_ip: ip, p_ua: req.headers.get('user-agent') ?? null });

  const { data: profile } = await admin.from('profiles').select('handle').eq('id', user.id).maybeSingle();
  return NextResponse.json({ ok: true, needsHandle: !profile?.handle });
}
