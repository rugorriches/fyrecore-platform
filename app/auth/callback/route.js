import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { createAdminClient } from '../../../lib/supabase/admin';

export const runtime = 'nodejs';

/** Magic-link landing. Creates the profile and Core on first sign-in. */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/core';

  if (!code) return NextResponse.redirect(`${origin}/join?error=missing_code`);

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/join?error=exchange_failed`);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const admin = createAdminClient();
    const { data: existing } = await admin
      .from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (!existing) {
      await admin.from('profiles').insert({ id: user.id, handle: `core_${user.id.slice(0, 8)}` });
      await admin.from('cores').insert({ user_id: user.id });
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}