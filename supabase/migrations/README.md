# Migrations

Applied to Supabase project `wmifzadxkmjweyvffggf`.

Three guarantees are enforced in Postgres rather than in application code:

1. `embers_balances` is derived from `embers_ledger` by trigger. The ledger is the
   only source of truth, so a missed service write cannot desync the balance.
2. `embers_ledger` rejects UPDATE and DELETE. It is append-only in the database.
3. The per-season earn cap and the no-negative-balance rule are triggers, so a bug
   in the service fails the request instead of minting Embers.

Views `economy_daily` and `season_flow` back the public ledger page. The Phase D
gate reads `season_flow.sink_faucet_ratio`, so the gate is computed, not asserted.

Pull current state with `supabase db pull` if you set up the CLI.