import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import BuyUsdc from '../../components/BuyUsdc';

export const metadata = { title: 'Store' };
export const dynamic = 'force-dynamic';

const KIND = { cosmetic:'Cosmetic', pass:'Pass', pack:'Pack', perk:'Perk', upgrade:'Upgrade', entry:'Entry' };

/**
 * Fixed-contents storefront. Everything here has known contents at a fixed USD price,
 * is paid in USDC on Base, and (unlike box drops) is tradeable and Vault-redeemable.
 */
export default async function Store() {
  let skus = [], games = [], owned = new Set();
  if (isSupabaseConfigured()) {
    const s = createClient();
    const [{ data: k }, { data: g }, { data: { user } }] = await Promise.all([
      s.from('skus').select('id, code, name, kind, price_usd_cents, supply_cap, sold, game_id, asset_tags, metadata').eq('active', true).neq('kind', 'box').order('game_id').order('price_usd_cents'),
      s.from('games').select('id, name, slug, section').eq('section', 'fyrecore'),
      s.auth.getUser()
    ]);
    skus = (k ?? []).filter(x => x.kind !== 'entry' || process.env.NEXT_PUBLIC_PRIZE_ESCROW_ADDRESS); games = g ?? [];
    if (user) { const { data: e } = await s.from('entitlements').select('sku_id'); owned = new Set((e ?? []).map(x => x.sku_id)); }
  }
  const byGame = games.map(g => ({ g, items: skus.filter(x => x.game_id === g.id) })).filter(x => x.items.length);
  const orphan = skus.filter(x => !games.some(g => g.id === x.game_id));

  const Grid = ({ items }) => (
    <div className="ngrid">
      {items.map((x, i) => {
        const soldOut = x.supply_cap != null && (x.sold ?? 0) >= x.supply_cap;
        return (
          <article className="ncard reveal" key={x.id} style={{'--i': i}}>
            <div className="ncard__art" aria-hidden="true"><span>{x.name.slice(0, 1)}</span></div>
            <div className="ncard__body">
              <div className="gcard__top"><span className="tag tag--fc">{KIND[x.kind] ?? x.kind}</span><span className="gcard__status">{x.supply_cap != null ? `${(x.sold ?? 0).toLocaleString()} / ${x.supply_cap.toLocaleString()}` : 'Open supply'}</span></div>
              <h3>{x.name}</h3>
              <p className="ncard__rule">Fixed contents. Tradeable on the Forge, redeemable through the Vault. Cosmetic or access only &mdash; no yield, no gameplay effect.</p>
              {owned.has(x.id)
                ? <span className="btn btn--ghost" style={{justifyContent:'center'}}>Owned</span>
                : <BuyUsdc skuId={x.id} priceUsdCents={x.price_usd_cents} soldOut={soldOut} />}
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section className="section"><div className="wrap">
      <div className="head head--wide">
        <span className="eyebrow">Store</span>
        <h2>Fixed contents. Fixed price. Paid in USDC.</h2>
        <p>Every item here shows you exactly what you get before you pay. Prices are in dollars and settle in USDC on Base at exactly that amount, from any wallet. What you buy here can be traded or redeemed; what comes out of a <a href="/boxes">box</a> never can.</p>
      </div>

      {!skus.length && <div className="empty"><strong>The store is not live on this deployment</strong>The catalog loads once the platform is connected.</div>}
      {byGame.map(({ g, items }) => (
        <div key={g.id}>
          <div className="head head--wide" style={{marginTop:'3rem'}}><span className="eyebrow">{g.name}</span><h2 style={{fontSize:'var(--s2)'}}>{g.name} items</h2></div>
          <Grid items={items} />
        </div>
      ))}
      {orphan.length > 0 && (<div><div className="head head--wide" style={{marginTop:'3rem'}}><h2 style={{fontSize:'var(--s2)'}}>Platform</h2></div><Grid items={orphan} /></div>)}

      <div className="note" style={{marginTop:'3rem'}} id="usdc">
        <p><strong>Paying in USDC on Base.</strong> You need a wallet you control &mdash; MetaMask, Rabby, or any WalletConnect wallet on your phone &mdash; holding USDC on the Base network, plus a few cents of ETH on Base for gas. Any exchange that supports Base withdrawals can send USDC there directly. The first purchase asks for two wallet confirmations &mdash; one approval, one payment; after that, one. We never see your keys, and the contract only accepts a price our server signed for that exact order.</p>
      </div>
    </div></section>
  );
}
