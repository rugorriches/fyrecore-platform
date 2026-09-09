import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Create a developer app. Returns the row AS PERSISTED, re-read from the
 * database - never the request body echoed back. The OMEN portal's silent-save
 * bug ("updated successfully" while nothing changed) is the reason.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }

  const name = String(body?.name ?? '').trim().slice(0, 80);
  const gameId = body?.gameId ? Number(body.gameId) : null;
  const lane = ['open','certified','both'].includes(body?.lane) ? body.lane : 'open';
  const redirectUris = Array.isArray(body?.redirectUris)
    ? body.redirectUris.map(String).filter(u => /^https?:\/\/[^\s]+$/.test(u)).slice(0, 10) : [];
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: dev } = await admin.from('developers').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!dev) return NextResponse.json({ error: 'register a studio first' }, { status: 403 });

  const clientId = 'fc_' + crypto.randomBytes(12).toString('hex');
  const { data: inserted, error } = await admin.from('developer_apps')
    .insert({ developer_id: user.id, game_id: gameId, name, lane, client_id: clientId, redirect_uris: redirectUris })
    .select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: persisted } = await admin.from('developer_apps').select('*').eq('id', inserted.id).single();
  return NextResponse.json({ app: persisted, verified: Boolean(persisted && persisted.client_id === clientId) });
}