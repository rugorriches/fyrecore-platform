import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

/** Refreshes the auth session cookie on navigation. */
export async function middleware(request) {
  let response = NextResponse.next({ request });

  // Before the env vars are set, do nothing rather than crash every route.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Sign-in required for most of the platform. Public: the Forge, joining, auth, legal, FAQ, shared player pages,
  // and inbound webhooks / server-to-server routes which carry their own signatures.
  const p = request.nextUrl.pathname;
  const isPublic = p === '/' || p === '/join' || p.startsWith('/auth/') || p === '/legal' || p === '/faq' || p.startsWith('/u/')
    || p.startsWith('/api/webhooks/') || p.startsWith('/api/auth/') || p === '/api/matches/report' || p === '/api/ledger';
  if (!user && !isPublic) {
    if (p.startsWith('/api/')) return NextResponse.json({ error: 'not signed in' }, { status: 401 });
    const url = request.nextUrl.clone(); url.pathname = '/join'; url.search = `?next=${encodeURIComponent(p + request.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)']
};