import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { rollBox, DUPE_EMBERS } from '../../../../lib/boxes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Open a paid box. Requires the order to be 'paid', which only /api/checkout/confirm sets,
 * and only after reading a Purchase event from OUR contract off the on-chain receipt.
 * Rolls, applies pity, writes bound inventory, converts duplicates to Embers,
 * then reveals the server seed so the roll can be recomputed by anyone.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const openingId = Number(body?.openingId);
  if (!openingId) return NextResponse.json({ error: 'openingId required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: op } = await admin.from('box_openings').select('*').eq('id', openingId).eq('user_id', user.id).single();
  if (!op) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (op.opened_at) return NextResponse.json({ results: op.results, serverSeed: op.server_seed, clientSeed: op.client_seed, nonce: op.nonce, alreadyOpened: true });

  const { data: order } = await admin.from('orders').select('id, state').eq('opening_id', openingId).single();
  if (!order || order.state !== 'paid') return NextResponse.json({ error: 'not paid', state: order?.state ?? 'none' }, { status: 402 });

  const [{ data: box }, { data: odds }, { data: pool }, { data: rar }, { data: pity }] = await Promise.all([
    admin.from('box_defs').select('*').eq('id', op.box_id).single(),
    admin.from('box_odds').select('rarity, weight_bps').eq('box_id', op.box_id),
    admin.from('box_pool').select('item_defs(id, code, name, rarity, asset_tag)').eq('box_id', op.box_id),
    admin.from('rarities').select('key, rank'),
    admin.from('box_pity').select('since_pity').eq('user_id', user.id).eq('box_id', op.box_id).maybeSingle()
  ]);
  const ranks = Object.fromEntries((rar ?? []).map(x => [x.key, x.rank]));
  const items = (pool ?? []).map(p => p.item_defs).filter(Boolean);

  const { results, nextSincePity } = rollBox({
    box, odds: odds ?? [], pool: items, ranks,
    serverSeed: op.server_seed, clientSeed: op.client_seed, nonce: op.nonce, sincePity: pity?.since_pity ?? 0
  });

  // Duplicates -> Embers. Never money. Everything else -> bound inventory.
  const { data: owned } = await admin.from('inventory').select('item_def_id').eq('user_id', user.id).not('item_def_id', 'is', null);
  const ownedSet = new Set((owned ?? []).map(o => o.item_def_id));
  const { data: season } = await admin.from('seasons').select('id').order('id', { ascending: false }).limit(1).single();

  let embersFromDupes = 0;
  for (const d of results) {
    if (!d.item_id) continue;
    if (ownedSet.has(d.item_id)) {
      d.duplicate = true; const e = DUPE_EMBERS[d.rarity] ?? 50; d.embers = e; embersFromDupes += e;
    } else {
      ownedSet.add(d.item_id);
      await admin.from('inventory').insert({ user_id: user.id, item_def_id: d.item_id, qty: 1, state: 'off_chain', bound: true, from_opening_id: op.id });
    }
  }
  if (embersFromDupes > 0 && season) {
    await admin.from('embers_ledger').insert({ user_id: user.id, season_id: season.id, delta: embersFromDupes, reason: 'box_duplicate', ref_type: 'opening', ref_id: String(op.id) }).then(() => {}, () => {});
  }

  await admin.from('box_pity').upsert({ user_id: user.id, box_id: op.box_id, since_pity: nextSincePity });
  await admin.from('box_openings').update({ results, opened_at: new Date().toISOString() }).eq('id', op.id);
  await admin.from('orders').update({ state: 'fulfilled', updated_at: new Date().toISOString() }).eq('id', order.id);

  return NextResponse.json({ results, serverSeed: op.server_seed, serverSeedHash: op.server_seed_hash, clientSeed: op.client_seed, nonce: op.nonce, pity: { sincePity: nextSincePity, pityAfter: box.pity_after, pityRarity: box.pity_rarity }, embersFromDupes });
}