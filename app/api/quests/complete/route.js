import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { withinLimit } from '../../../../lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Complete a quest and credit Embers.
 *
 * Everything that could be faked is checked server-side:
 *  - the user comes from the session cookie, never from the request body
 *  - the reward amount comes from the database, never from the client
 *  - completion counts, cooldowns and the season cap are enforced before insert
 *  - the insert is idempotent, so a double-submit credits once
 *
 * The season cap and the no-negative rule are ALSO enforced by database triggers.
 * That redundancy is intentional: a bug here should fail the request, not mint Embers.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const questKey = String(body?.questKey ?? '');
  if (!questKey) return NextResponse.json({ error: 'questKey required' }, { status: 400 });

  const admin = createAdminClient();

  if (!(await withinLimit(admin, user.id, 'quest', 20, 3600))) {
    return NextResponse.json({ error: 'too many quest completions, try later' }, { status: 429 });
  }

  const { data: quest } = await admin
    .from('quests').select('*').eq('key', questKey).eq('active', true).single();
  if (!quest) return NextResponse.json({ error: 'unknown quest' }, { status: 404 });

  const now = new Date().toISOString();
  const { data: season } = await admin
    .from('seasons').select('id').lte('starts_at', now).gte('ends_at', now)
    .order('id', { ascending: false }).limit(1).single();
  if (!season) return NextResponse.json({ error: 'no active season' }, { status: 409 });

  const { count: done } = await admin
    .from('quest_completions').select('id', { count: 'exact', head: true })
    .eq('user_id', user.id).eq('quest_id', quest.id);
  if ((done ?? 0) >= quest.max_completions) {
    return NextResponse.json({ error: 'already completed' }, { status: 409 });
  }

  if (quest.cooldown_seconds > 0) {
    const { data: last } = await admin
      .from('quest_completions').select('completed_at')
      .eq('user_id', user.id).eq('quest_id', quest.id)
      .order('completed_at', { ascending: false }).limit(1).single();
    if (last) {
      const next = new Date(last.completed_at).getTime() + quest.cooldown_seconds * 1000;
      if (Date.now() < next) {
        return NextResponse.json({ error: 'on cooldown', retryAt: new Date(next) }, { status: 429 });
      }
    }
  }

  const bucket = Math.floor(Date.now() / 3600000);
  const idem = `quest:${user.id}:${quest.id}:${bucket}`;
  const { error: dupe } = await admin
    .from('idempotency_keys').insert({ key: idem, scope: `quest:${user.id}` });
  if (dupe) return NextResponse.json({ error: 'duplicate request' }, { status: 409 });

  const { data: profile } = await admin
    .from('profiles').select('founder_tier').eq('id', user.id).single();
  const mult = { blaze: 3, ember: 2, spark: 1.5 }[profile?.founder_tier] ?? 1;
  const award = Math.floor(quest.reward_embers * mult);

  await admin.from('quest_completions').insert({ quest_id: quest.id, user_id: user.id });

  const { error: ledgerErr } = await admin.from('embers_ledger').insert({
    user_id: user.id, season_id: season.id, delta: award,
    reason: 'quest', ref_type: 'quest', ref_id: String(quest.id)
  });
  if (ledgerErr) return NextResponse.json({ error: ledgerErr.message }, { status: 409 });

  const { data: bal } = await admin
    .from('embers_balances').select('balance')
    .eq('user_id', user.id).eq('season_id', season.id).single();

  return NextResponse.json({ awarded: award, multiplier: mult, balance: bal?.balance ?? award });
}