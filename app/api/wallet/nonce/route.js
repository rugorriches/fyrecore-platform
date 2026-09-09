import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { linkMessage } from '../../../../lib/wallet-link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Issue a 10-minute nonce for the signed-in user. */
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });
  const nonce = crypto.randomBytes(16).toString('hex');
  const admin = createAdminClient();
  const { error } = await admin.from('wallet_link_nonces').upsert({ user_id: user.id, nonce, expires_at: new Date(Date.now() + 600_000).toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';
  return NextResponse.json({ message: linkMessage(nonce, site) });
}
