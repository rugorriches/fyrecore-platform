import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Match results from the authoritative game server. Never called by a browser.
 *
 * Signed with GAME_SERVER_SECRET over timestamp + raw body, compared in constant
 * time. A replayed or stale report is rejected.
 *
 * Note what this route does NOT do: it does not advance anyone toward the FYRE
 * play threshold. Matches land pending review, because the whole value of Earned
 * Transferability is that the match filter is honest.
 */
export async function POST(req) {
  const raw = await req.text();
  const sig = req.headers.get('x-fyrecore-signature') ?? '';
  const ts  = req.headers.get('x-fyrecore-timestamp') ?? '';

  const secret = process.env.GAME_SERVER_SECRET;
  if (!secret) return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });

  const skew = Math.abs(Date.now() - Number(ts));
  if (!ts || Number.isNaN(skew) || skew > 300000) {
    return NextResponse.json({ error: 'stale or missing timestamp' }, { status: 401 });
  }

  const expected = crypto.createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  }

  let body;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const { tournamentId, gameId, round, p1, p2, winner, replayHash } = body ?? {};
  if (!p1 || !p2 || !winner || ![p1, p2].includes(winner)) {
    return NextResponse.json({ error: 'invalid match' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from('matches').insert({
    tournament_id: tournamentId ?? null,
    game_id: gameId ?? null,
    round: round ?? null,
    p1, p2, winner,
    rated: true,
    replay_hash: replayHash ?? null,
    review_state: 'pending',
    counts_toward_threshold: false
  }).select('id').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ matchId: data.id, reviewState: 'pending' });
}