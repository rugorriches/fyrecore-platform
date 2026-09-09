import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook, verified without the SDK: Stripe-Signature carries t= and v1=;
 * v1 = HMAC-SHA256(secret, `${t}.${rawBody}`). Constant-time compare, 5-minute window.
 * On checkout.session.completed: mark the order paid; for SKU orders, grant entitlements.
 */
export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'not configured' }, { status: 503 });

  const raw = await req.text();
  const header = req.headers.get('stripe-signature') ?? '';
  const parts = Object.fromEntries(header.split(',').map(p => p.split('=')));
  const t = Number(parts.t); const v1 = parts.v1 ?? '';
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return NextResponse.json({ error: 'stale' }, { status: 401 });
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(v1);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return NextResponse.json({ error: 'bad signature' }, { status: 401 });

  let evt; try { evt = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  if (evt.type !== 'checkout.session.completed') return NextResponse.json({ ok: true, ignored: evt.type });

  const s = evt.data?.object ?? {};
  const orderId = Number(s.metadata?.order_id ?? s.client_reference_id);
  if (!orderId) return NextResponse.json({ error: 'no order id' }, { status: 400 });

  const admin = createAdminClient();
  // Idempotent: a second delivery of the same event is a no-op.
  const { error: idem } = await admin.from('idempotency_keys').insert({ key: `stripe:${evt.id}`, scope: 'stripe' });
  if (idem) return NextResponse.json({ ok: true, duplicate: true });

  const { data: order } = await admin.from('orders').select('id, user_id, sku_id, qty, state, opening_id').eq('id', orderId).single();
  if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 });
  if (order.state === 'paid' || order.state === 'fulfilled') return NextResponse.json({ ok: true });

  await admin.from('orders').update({
    state: 'paid', provider_ref: s.id, amount_paid: (s.amount_total ?? 0) / 100, rate_usd: 1, rate_source: 'stripe', rate_quoted_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }).eq('id', orderId);

  // Non-box SKUs are fulfilled here: grant asset tags as entitlements.
  if (!order.opening_id) {
    const { data: sku } = await admin.from('skus').select('asset_tags, price_usd_cents').eq('id', order.sku_id).single();
    for (const tag of sku?.asset_tags ?? []) {
      await admin.from('entitlements').upsert({ user_id: order.user_id, sku_id: order.sku_id, asset_tag: tag, order_id: orderId }, { onConflict: 'user_id,asset_tag' });
    }
    await admin.from('orders').update({ state: 'fulfilled' }).eq('id', orderId);
    await admin.from('treasury_ledger').insert({ category: 'cosmetic_sale', amount_usd: (s.amount_total ?? 0) / 100, note: `order ${orderId}` });
  } else {
    await admin.from('treasury_ledger').insert({ category: 'cosmetic_sale', amount_usd: (s.amount_total ?? 0) / 100, note: `box order ${orderId}` });
  }
  return NextResponse.json({ ok: true });
}