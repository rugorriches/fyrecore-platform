/**
 * Per-user, per-scope limiter backed by Postgres.
 *
 * Deliberately not in-memory: serverless functions do not share memory, so an
 * in-memory limiter on Vercel limits nothing.
 */
export async function withinLimit(admin, userId, scope, max, windowSeconds) {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count, error } = await admin
    .from('idempotency_keys')
    .select('key', { count: 'exact', head: true })
    .eq('scope', `${scope}:${userId}`)
    .gte('created_at', since);
  if (error) return false;
  return (count ?? 0) < max;
}