import { NextResponse } from 'next/server';
import { encodeAbiParameters, keccak256, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { checkAccess } from '../../../../lib/access';
import { CHAIN, USDC, CHECKOUT, USDC_DECIMALS, isChainConfigured } from '../../../../lib/chain';
import { newServerSeed, hashSeed } from '../../../../lib/boxes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * USDC quote. Same shape for a SKU or a box:
 *  - price is USD cents from the catalog; USDC amount = cents * 10^4 (6 decimals)
 *  - the quoter signs (orderId, buyer, token, amount, priceUsdCents, skuId, qty, deadline, contract, chainId)
 *  - the voucher expires in 10 minutes
 * The client sends this straight to SignedCheckout.pay(); the contract verifies the signature.
 */
export async function POST(req) {
  if (!isChainConfigured() || !process.env.QUOTER_PRIVATE_KEY) return NextResponse.json({ error: 'USDC checkout not configured' }, { status: 503 });
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });

  let body; try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const buyer = String(body?.buyer ?? '');
  const skuId = Number(body?.skuId); const boxId = body?.boxId ? Number(body.boxId) : null;
  const qty = Math.max(1, Math.min(10, Number(body?.qty ?? 1)));
  if (!/^0x[0-9a-fA-F]{40}$/.test(buyer)) return NextResponse.json({ error: 'buyer address required' }, { status: 400 });

  const admin = createAdminClient();
  let sku;
  if (boxId) {
    const gate = await checkAccess(user.id, 'random_boxes');
    if (!gate.allowed) return NextResponse.json({ error: gate.reason, needsVerification: gate.needs_verification }, { status: 403 });
    const { data: box } = await admin.from('box_defs').select('id, sku_id, price_usd_cents').eq('id', boxId).eq('active', true).single();
    if (!box) return NextResponse.json({ error: 'unknown box' }, { status: 404 });
    const { data: s } = await admin.from('skus').select('*').eq('id', box.sku_id).single(); sku = s;
  } else {
    const { data: s } = await admin.from('skus').select('*').eq('id', skuId).eq('active', true).single(); sku = s;
  }
  if (!sku) return NextResponse.json({ error: 'unknown sku' }, { status: 404 });

  // Box: commit to a seed before payment, as with Stripe.
  let openingId = null;
  if (boxId) {
    const clientSeed = String(body?.clientSeed ?? '').slice(0, 64) || 'usdc';
    const { count: n } = await admin.from('box_openings').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_id', boxId);
    const seed = newServerSeed();
    const { data: op } = await admin.from('box_openings').insert({ user_id: user.id, box_id: boxId, server_seed_hash: hashSeed(seed), server_seed: seed, client_seed: clientSeed, nonce: (n ?? 0) + 1 }).select('id, server_seed_hash').single();
    openingId = op?.id ?? null;
  }

  const priceUsdCents = sku.price_usd_cents * qty;
  const amount = BigInt(priceUsdCents) * 10n ** BigInt(USDC_DECIMALS - 2);
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const { data: order, error } = await admin.from('orders').insert({
    user_id: user.id, sku_id: sku.id, qty, price_usd_cents: priceUsdCents, currency: 'usdc', provider: 'base_onchain', state: 'quoted',
    amount_paid: Number(amount) / 1e6, rate_usd: 1, rate_source: 'usdc_par', rate_quoted_at: new Date().toISOString(), opening_id: openingId
  }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orderId = keccak256(toHex(`fyrecore:order:${order.id}`));
  const digest = keccak256(encodeAbiParameters(
    [{type:'bytes32'},{type:'address'},{type:'address'},{type:'uint256'},{type:'uint256'},{type:'uint32'},{type:'uint32'},{type:'uint256'},{type:'address'},{type:'uint256'}],
    [orderId, buyer, USDC, amount, BigInt(priceUsdCents), sku.id, qty, BigInt(deadline), CHECKOUT, BigInt(CHAIN.id)]
  ));
  const quoter = privateKeyToAccount(process.env.QUOTER_PRIVATE_KEY);
  const sig = await quoter.signMessage({ message: { raw: digest } });   // EIP-191, matches toEthSignedMessageHash in the contract

  await admin.from('orders').update({ provider_ref: orderId }).eq('id', order.id);

  return NextResponse.json({
    orderDbId: order.id, openingId, chainId: CHAIN.id, checkout: CHECKOUT, token: USDC,
    voucher: { orderId, token: USDC, amount: amount.toString(), priceUsdCents, skuId: sku.id, qty, deadline, sig }
  });
}