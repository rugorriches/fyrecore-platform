# FyreCore

Competition-backed game platform. Next.js 14 App Router, Supabase Postgres, Base L2.

## The rule that matters

**No value-bearing write ever happens from the browser.** The anon key can only read;
there are no client write policies on any economy table. Embers, inventory, tournament
entries and settlement all go through server-only routes in `app/api/` using the service
role key, which never reaches the client bundle.

If you find yourself reaching for the service role key in a client component, that is the bug.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the two secret values
npm run dev
```

## Environment

| Variable | Where | Secret |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | no |
| `NEXT_PUBLIC_SITE_URL` | client | no |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **yes** |
| `GAME_SERVER_SECRET` | server only | **yes** |

Do not add the service role key to Preview. Preview deployments are publicly reachable
by URL and that key bypasses row level security completely.

The site builds and runs with none of these set: pages degrade to an empty state rather
than erroring, so a first deploy is never broken by a missing variable.

## Supabase auth

Auth to URL Configuration, add redirect URLs:
`https://www.fyrecore.app/auth/callback`, `http://localhost:3000/auth/callback`,
and `https://*.vercel.app/auth/callback` for previews. Magic-link sign-in silently
fails to redirect without these.

## Related repos

- `rugorriches/FyreCore` currently holds ASCENSION, the fighting game (Vite + Three.js).
  It should be renamed `ascension`; this platform belongs in its own repo.