import { createClient, isSupabaseConfigured } from './supabase/server';

/**
 * Catalog reads for public pages. Every function returns the fallback when
 * Supabase is not configured or errors, so pages render an honest catalog
 * instead of a 500 before env vars exist. Fallback mirrors the seed.
 */

const FALLBACK_GAMES = [
  { slug:'ascension', name:'Ascension', genre:'Anime arena fighter', status:'alpha', section:'fyrecore', placement:'confirmed', engine:'Vite + Three.js',
    tagline:'Original anime arena fighter', lane:'open', accepted_currencies:['usd','usdc','omenx','gmt'], featured:true, sort_order:1,
    play_url:'https://ascension-peach.vercel.app' },
  { slug:'rift-runner', name:'Rift Runner', genre:'Arcade racer-shooter', status:'alpha', section:'fyrecore', placement:'tentative', engine:'WebGL',
    tagline:'Rail racer with extract-or-continue runs', lane:'both', accepted_currencies:['usd','usdc','omenx','gmt'], sort_order:2,
    play_url:'https://rift-runner-rug-or-riches.vercel.app' },
  { slug:'warfront', name:'Warfront', genre:'Tactical war', status:'development', section:'fyrecore', placement:'confirmed', tagline:'Concept', lane:'open', accepted_currencies:['usd','usdc'], sort_order:3 },
  { slug:'breachpoint', name:'Breachpoint', genre:'First-person shooter', status:'development', section:'fyrecore', placement:'confirmed', tagline:'Concept', lane:'open', accepted_currencies:['usd','usdc'], sort_order:4 },
  { slug:'ashlands', name:'Ashlands', genre:'Open world', status:'development', section:'fyrecore', placement:'confirmed', tagline:'Concept', lane:'open', accepted_currencies:['usd','usdc'], sort_order:5 },
  { slug:'last-bastion', name:'Last Bastion', genre:'Survival', status:'development', section:'omen', placement:'confirmed', engine:'Three.js', tagline:'Siege survival on the OMEN platform', lane:'open', accepted_currencies:['omenx','gmt'], sort_order:10 },
  { slug:'nova-kata', name:'Nova Kata', genre:'Stick-figure fighter', status:'alpha', section:'omen', placement:'tentative', engine:'Next.js + Phaser', tagline:'Browser fighting game, placement undecided', lane:'open', accepted_currencies:['omenx','gmt'], sort_order:11 }
];

const FALLBACK_COLLECTIONS = [
  { slug:'founders-pass', name:"Founder's Pass", tier:'fyrecore', chain:'base', kind:'pass', supply_cap:11750, minted:0, status:'planned', sort_order:1,
    description:'Early access and cosmetics across every FyreCore title. Three tiers. No rewards, no revenue share.',
    perks:['Early access to all FyreCore titles','Exclusive cosmetics per title','Embers multiplier','Founder bracket seats'] },
  { slug:'ascension-genesis', name:'Ascension Genesis Skins', tier:'fyrecore', chain:'base', kind:'cosmetic', supply_cap:2000, minted:0, status:'planned', sort_order:2,
    description:'First cosmetic set for Ascension. Fixed contents, fixed USD price, redeemable through the Vault.',
    perks:['Character skins','Stage variants','Victory effects'] },
  { slug:'rift-runner-ships', name:'Rift Runner Ship Ladder', tier:'fyrecore', chain:'base', kind:'perk', supply_cap:null, minted:0, status:'planned', sort_order:3,
    description:'Eight-tier ship ladder from free to capped premium. If Rift Runner ships on FyreCore rails this is minted on our Base contracts and priced in USD.',
    perks:['Ship hull and stats','Upgrade slots','Certified Lane eligibility'] },
  { slug:'nova-kata-fighters', name:'Nova Kata Fighter Pass', tier:'omen', chain:'bsc', kind:'access', supply_cap:null, minted:0, status:'planned', sort_order:11,
    description:'Fighter unlocks and cosmetics on the OMEN platform under OMEN rules.',
    perks:['Fighter unlocks','Arena cosmetics'] }
];

async function safe(fn, fallback) {
  if (!isSupabaseConfigured()) return fallback;
  try { const r = await fn(createClient()); return r?.data?.length ? r.data : fallback; }
  catch { return fallback; }
}

export const getGames = (section) => safe(
  (s) => s.from('games').select('*').eq('section', section).order('sort_order'),
  FALLBACK_GAMES.filter(g => g.section === section)
);

export const getCollections = (tier) => safe(
  (s) => s.from('nft_collections').select('*').eq('tier', tier).order('sort_order'),
  FALLBACK_COLLECTIONS.filter(c => c.tier === tier)
);

export const CURRENCY = {
  usd:   { label:'Card',  sym:'$',   note:'Stripe' },
  usdc:  { label:'USDC',  sym:'$',   note:'Base' },
  omenx: { label:'OMENX', sym:'',    note:'BSC' },
  gmt:   { label:'GMT',   sym:'',    note:'BSC' }
};

export const STATUS = {
  development:'In development', alpha:'Playable alpha', soft_launch:'Soft launch', live:'Live',
  planned:'Planned', minting:'Minting', open:'Open', sold_out:'Sold out', closed:'Closed'
};