import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { checkAccess } from '../../../../lib/access';
import { newServerSeed, hashSeed } from '../../../../lib/boxes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Quote a box purchase. Order of operations matters:
 *  1. gate (geo + verification) - blocked users never reach payment
 *  2. commit to a server seed and publish its hash BEFORE money moves
 *  3. create the order in 'quoted' and, if Stripe is configured, a Checkout Session
 * The seed is stored server-side; only its hash leaves.
 */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const boxId = Number(body?.boxId);
  const clientSeed = String(body?.clientSeed ?? '').slice(0, 64);
  if (!boxId || !clientSeed) return NextResponse.json({ error: 'boxId and clientSeed required' }, { status: 400 });

  const gate = await checkAccess(user.id, 'random_boxes');
  if (!gate.allowed) return NextResponse.json({ error: gate.reason, needsVerification: gate.needs_verification, region: `${gate.country}/${gate.region ?? ''}` }, { status: 403 });

  const admin = createAdminClient();
  const { data: box } = await admin.from('box_defs').select('*').eq('id', boxId).eq('active', true).single();
  if (!box?.sku_id) return NextResponse.json({ error: 'unknown box' }, { status: 404 });

  const { count: n } = await admin.from('box_openings').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_id', boxId);
  const serverSeed = newServerSeed();
  const { data: opening, error: oe } = await admin.from('box_openings').insert({
    user_id: user.id, box_id: boxId, server_seed_hash: hashSeed(serverSeed), server_seed: serverSeed, client_seed: clientSeed, nonce: (n ?? 0) + 1
  }).select('id, server_seed_hash, nonce').single();
  if (oe) return NextResponse.json({ error: oe.message }, { status: 500 });

  const { data: order, error: oerr } = await admin.from('orders').insert({
    user_id: user.id, sku_id: box.sku_id, qty: 1, price_usd_cents: box.price_usd_cents, currency: 'usd',
    provider: 'stripe', state: 'quoted', opening_id: opening.id
  }).select('id').single();
  if (oerr) return NextResponse.json({ error: oerr.message }, { status: 500 });

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fyrecore.app';
  let checkoutUrl = null;
  if (process.env.STRIPE_SECRET_KEY) {
    const form = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': String(box.price_usd_cents),
      'line_items[0][price_data][product_data][name]': box.name,
      'line_items[0][quantity]': '1',
      success_url: `${site}/boxes?opening=${opening.id}`,
      cancel_url: `${site}/boxes`,
      'metadata[order_id]': String(order.id),
      'metadata[opening_id]': String(opening.id),
      'metadata[user_id]': user.id,
      client_reference_id: String(order.id)
    });
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' }, body: form
    });
    if (res.ok) { const s = await res.json(); checkoutUrl = s.url; await admin.from('orders').update({ provider_ref: s.id, state: 'pending' }).eq('id', order.id); }
  }

  return NextResponse.json({ openingId: opening.id, orderId: order.id, serverSeedHash: opening.server_seed_hash, nonce: opening.nonce, checkoutUrl, paymentConfigured: Boolean(checkoutUrl) });
}