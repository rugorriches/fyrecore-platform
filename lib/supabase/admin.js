import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client. Bypasses row level security completely.
 *
 * Import this ONLY from files under app/api/ or other server-only modules.
 * The guard below turns a leak into a crash rather than silently shipping the
 * key into the browser bundle.
 */
if (typeof window !== 'undefined') {
  throw new Error('admin client imported in the browser - this would leak the service role key');
}

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}