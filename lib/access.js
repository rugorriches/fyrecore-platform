import { headers } from 'next/headers';
import { createAdminClient } from './supabase/admin';

/**
 * Geo + verification gate. The region comes from Vercel's edge headers on the
 * request, never from anything the client sends. Mirrors the Last Bastion
 * approach: server-derived region, Didit approval, decision logged.
 *
 * Features: 'random_boxes' | 'paid_brackets' | 'high_stakes' | 'marketplace'
 */
export function requestGeo() {
  const h = headers();
  return {
    country: h.get('x-vercel-ip-country') || '*',
    region:  h.get('x-vercel-ip-country-region') || null
  };
}

export async function checkAccess(userId, feature, appId = null) {
  const { country, region } = requestGeo();
  const admin = createAdminClient();
  const { data, error } = await admin.rpc('fn_feature_access', {
    p_user: userId, p_feature: feature, p_country: country, p_region: region
  });
  const d = data?.[0] ?? { allowed: false, reason: error?.message ?? 'gate error', needs_verification: false, min_age: null };

  // Record the decision. This is the audit trail; it is never consulted for the decision itself.
  await admin.from('geofence_checks').insert({
    user_id: userId, app_id: appId, lane: feature, region, country, allowed: d.allowed, source: 'vercel_edge'
  });

  return { ...d, country, region };
}