import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { linkMessage } from '../../../../lib/wallet-link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verify a personal_sign over the server nonce and link the wallet to the Core.
 * The address is taken from the signature check, never trusted from the body alone.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const address = String(body?.address ?? ''); const signature = String(body?.signature ?? '');
  if (!/^0x[0-9a-fA-F]{40}$/.test(address) || !/^0x[0-9a-fA-F]+$/.test(signature)) return NextResponse.json({ error: 'address and signature required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: n } = await admin.from('wallet_link_nonces').select('nonce, expires_at').eq('user_id', user.id).maybeSingle();
  if (!n || new Date(n.expires_at) < new Date()) return NextResponse.json({ error: 'nonce expired — try again' }, { status: 400 });

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';
  const ok = await verifyMessage({ address, message: linkMessage(n.nonce, site), signature }).catch(() => false);
  if (!ok) return NextResponse.json({ error: 'signature does not match' }, { status: 401 });

  const { error } = await admin.rpc('fn_link_wallet', { p_user: user.id, p_wallet: address });
  if (error) return NextResponse.json({ error: /profiles_wallet_address_uniq/.test(error.message) ? 'that wallet is already linked to another Core' : error.message }, { status: 409 });
  return NextResponse.json({ ok: true, wallet: address.toLowerCase() });
}
