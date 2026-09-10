import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Sign out. scope=global (default) ends every session on every device; scope=local only this one. */
export async function POST(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const admin = createAdminClient();
    await admin.rpc('fn_record_auth_event', { p_user: user.id, p_event: 'sign_out', p_method: null, p_ip: null, p_ua: req.headers.get('user-agent') ?? null });
  }
  const scope = new URL(req.url).searchParams.get('scope') === 'local' ? 'local' : 'global';
  await supabase.auth.signOut({ scope });
  return NextResponse.json({ ok: true });
}
