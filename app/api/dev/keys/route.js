import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Rotate a game server key. The plaintext is returned exactly once; only a
 * SHA-256 hash is stored. Any previous active key for the app is revoked in
 * the same request so there is never more than one live credential.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const appId = Number(body?.appId);
  if (!appId) return NextResponse.json({ error: 'appId required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: app } = await admin.from('developer_apps').select('id, developer_id').eq('id', appId).single();
  if (!app || app.developer_id !== user.id) return NextResponse.json({ error: 'not your app' }, { status: 403 });

  const plaintext = 'fcsk_' + crypto.randomBytes(24).toString('hex');
  const hash = crypto.createHash('sha256').update(plaintext).digest('hex');

  await admin.from('game_server_keys').update({ revoked_at: new Date().toISOString() })
    .eq('app_id', appId).is('revoked_at', null);
  const { error } = await admin.from('game_server_keys')
    .insert({ app_id: appId, key_hash: hash, key_prefix: plaintext.slice(0, 10) });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ key: plaintext, prefix: plaintext.slice(0, 10), shownOnce: true });
}