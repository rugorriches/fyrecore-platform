import { NextResponse } from 'next/server';
import { decodeEventLog } from 'viem';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { publicClient, CHECKOUT, CHECKOUT_ABI, isChainConfigured } from '../../../../lib/chain';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Confirm a USDC purchase from its transaction hash. The server reads the receipt
 * from the chain itself and only trusts a Purchase event emitted by OUR contract
 * with an orderId matching the order in our database. The client's word counts for nothing.
 */
export async function POST(req) {
  if (!isChainConfigured()) return NextResponse.json({ error: 'not configured' }, { status: 503 });
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const txHash = String(body?.txHash ?? ''); const orderDbId = Number(body?.orderDbId);
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash) || !orderDbId) return NextResponse.json({ error: 'txHash and orderDbId required' }, { status: 400 });

  const admin = createAdminClient();
  const { data: order } = await admin.from('orders').select('*').eq('id', orderDbId).eq('user_id', user.id).single();
  if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 });
  if (order.state === 'paid' || order.state === 'fulfilled') return NextResponse.json({ ok: true, state: order.state });

  const rc = await publicClient().getTransactionReceipt({ hash: txHash }).catch(() => null);
  if (!rc || rc.status !== 'success') return NextResponse.json({ error: 'transaction not found or failed yet' }, { status: 409 });

  let hit = null;
  for (const log of rc.logs) {
    if (log.address.toLowerCase() !== CHECKOUT.toLowerCase()) continue;
    try { const ev = decodeEventLog({ abi: CHECKOUT_ABI, data: log.data, topics: log.topics }); if (ev.eventName === 'Purchase' && ev.args.orderId.toLowerCase() === String(order.provider_ref).toLowerCase()) { hit = ev.args; break; } } catch {}
  }
  if (!hit) return NextResponse.json({ error: 'no matching Purchase event in that transaction' }, { status: 400 });

  const { error: idem } = await admin.from('idempotency_keys').insert({ key: `tx:${txHash}`, scope: 'onchain' });
  if (idem) return NextResponse.json({ ok: true, duplicate: true });

  await admin.from('orders').update({ state: 'paid', tx_hash: txHash, updated_at: new Date().toISOString() }).eq('id', orderDbId);

  if (!order.opening_id) {
    const { data: sku } = await admin.from('skus').select('asset_tags').eq('id', order.sku_id).single();
    for (const tag of sku?.asset_tags ?? []) await admin.from('entitlements').upsert({ user_id: user.id, sku_id: order.sku_id, asset_tag: tag, order_id: orderDbId }, { onConflict: 'user_id,asset_tag' });
    await admin.from('orders').update({ state: 'fulfilled', fulfilled_tx: txHash }).eq('id', orderDbId);
  }
  await admin.from('treasury_ledger').insert({ category: 'cosmetic_sale', amount_usd: order.price_usd_cents / 100, note: `usdc ${txHash}` });

  return NextResponse.json({ ok: true, state: order.opening_id ? 'paid' : 'fulfilled', openingId: order.opening_id });
}