import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { createAdminClient } from '../../../lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Owner edits their profile. Validation lives in fn_update_profile + table constraints. */
export async function PATCH(req) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not signed in' }, { status: 401 });
  let b; try { b = await req.json(); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }

  const handle = typeof b.handle === 'string' ? b.handle.trim().toLowerCase() : null;
  if (handle && !/^[a-z0-9_]{3,20}$/.test(handle)) return NextResponse.json({ error: 'handle: 3–20 letters, digits or underscore' }, { status: 400 });

  const { error } = await supabase.rpc('fn_update_profile', {
    p_handle: handle, p_display: typeof b.display_name === 'string' ? b.display_name.trim().slice(0, 32) : null,
    p_bio: typeof b.bio === 'string' ? b.bio.trim().slice(0, 280) : null,
    p_region: typeof b.region === 'string' ? b.region.trim().slice(0, 40) : null,
    p_public: typeof b.public_profile === 'boolean' ? b.public_profile : null
  });
  if (error) return NextResponse.json({ error: /profiles_handle_uniq/.test(error.message) ? 'that handle is taken' : error.message }, { status: 409 });

  const admin = createAdminClient();
  await admin.rpc('fn_record_auth_event', { p_user: user.id, p_event: 'profile_updated', p_method: null, p_ip: null, p_ua: null });
  return NextResponse.json({ ok: true });
}
