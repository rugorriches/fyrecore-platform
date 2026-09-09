import crypto from 'node:crypto';

/**
 * Box drop engine. Pure: no I/O. Everything it needs is passed in, so the
 * same roll can be recomputed by anyone holding the revealed seed.
 *
 * roll(i) = first 4 bytes of HMAC-SHA256(serverSeed, `${clientSeed}:${nonce}:${i}`) / 2^32
 */
export function rollFloat(serverSeed, clientSeed, nonce, i) {
  const h = crypto.createHmac('sha256', serverSeed).update(`${clientSeed}:${nonce}:${i}`).digest();
  return h.readUInt32BE(0) / 0x100000000;
}

export function newServerSeed() { return crypto.randomBytes(32).toString('hex'); }
export function hashSeed(seed) { return crypto.createHash('sha256').update(seed).digest('hex'); }

/**
 * @param box       { drops_per_box, guaranteed_min_rarity_drops, min_rarity, pity_rarity, pity_after }
 * @param odds      [{ rarity, weight_bps }]
 * @param pool      [{ id, rarity, ... }]  bound items only (enforced by DB trigger)
 * @param ranks     { rarityKey: rank }
 * @param sincePity number of boxes opened since last pity-or-better drop
 */
export function rollBox({ box, odds, pool, ranks, serverSeed, clientSeed, nonce, sincePity }) {
  const drops = [];
  const floorRank = ranks[box.min_rarity];
  const aboveFloor = odds.filter(o => ranks[o.rarity] > floorRank);
  const pityRank = box.pity_rarity ? ranks[box.pity_rarity] : null;
  const forcePity = pityRank != null && (sincePity + 1) >= box.pity_after;

  let i = 0;
  const pickRarity = (table) => {
    const total = table.reduce((a, o) => a + o.weight_bps, 0);
    let x = rollFloat(serverSeed, clientSeed, nonce, i++) * total;
    for (const o of table) { x -= o.weight_bps; if (x < 0) return o.rarity; }
    return table[table.length - 1].rarity;
  };
  const pickItem = (rarity) => {
    const cands = pool.filter(p => p.rarity === rarity);
    if (cands.length === 0) return null;
    return cands[Math.floor(rollFloat(serverSeed, clientSeed, nonce, i++) * cands.length)];
  };

  // 1. pity slot, if due
  if (forcePity) {
    const r = odds.filter(o => ranks[o.rarity] >= pityRank);
    drops.push(pickRarity(r.length ? r : [{ rarity: box.pity_rarity, weight_bps: 1 }]));
  }
  // 2. guaranteed above-floor slots
  while (drops.length < box.guaranteed_min_rarity_drops && aboveFloor.length) drops.push(pickRarity(aboveFloor));
  // 3. the rest on full odds
  while (drops.length < box.drops_per_box) drops.push(pickRarity(odds));

  const results = drops.map((rarity, slot) => {
    let item = pickItem(rarity);
    // if the pool has nothing at that rarity, step down until it does
    let rr = ranks[rarity];
    while (!item && rr > 1) { rr--; const key = Object.keys(ranks).find(k => ranks[k] === rr); item = pickItem(key); }
    return { slot, rarity: item?.rarity ?? rarity, item_id: item?.id ?? null, code: item?.code ?? null, name: item?.name ?? null, asset_tag: item?.asset_tag ?? null };
  });

  // highest rarity reveals last
  results.sort((a, b) => ranks[a.rarity] - ranks[b.rarity]).forEach((d, idx) => d.slot = idx);

  const gotPity = pityRank != null && results.some(d => ranks[d.rarity] >= pityRank);
  return { results, nextSincePity: gotPity ? 0 : sincePity + 1 };
}

export const DUPE_EMBERS = { common: 50, uncommon: 120, rare: 300, epic: 800, legendary: 2500, mythic: 8000, relic: 25000 };