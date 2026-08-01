# Vocab Booster demote / attempt-log fix (for `saltmorning`)

This agent cannot push to `iancentralpark/saltmorning` (403). Code was deployed to Railway via CLI from the local fix tree.

## Deploy status (2026-08-01)
- **Railway (`mrpark.online`)**: deployed — live `/api/health` shows `portalBuild: "2026-08-01.01"`.
- **Supabase migration `019_vocab_promotion_ladder.sql`**: **not applied yet** (needs SQL Editor or `SUPABASE_DB_URL`). Without it, `shield_count` / `test_attempt_log` / `vocab_activity_events` writes can fail.

## What was wrong
1. **Arthur** demoted after **1 idle day** — inactivity decay ignored the **3-day grace**.
2. **Jei** had `testAttempts: 2` / last score **70% (7/10)** but **no per-attempt rows** and **no `vocab_set` activity** — only the last `test_score` was kept, and failed/non-reward submits were not logged.
3. Score math: `delta = (correct - total/2) * 3` → **7/10 = +6**. A 70% test must not demote by itself. Jei’s demote was a separate false inactivity/login demote; afterward +6 explains promo **396** (= 390 re-entry + 6).
4. `todayStr()` used server **UTC** date on Railway → idle-day / quest_date skew vs Seoul.

## Immediate data repair (already done on production via teacher API)
- Jei → **Emerald (G7)** (placement kept)
- Arthur → **Silver (G4)** (placement kept)
- Note: override reset their promotion scores to **0** (prod override behavior).

## Remaining: run migration 019
Open Supabase SQL Editor for project `tedzjzntesjslpiefbbi` and run `server/supabase/migrations/019_vocab_promotion_ladder.sql` (safe to re-run).

Or set `SUPABASE_DB_URL` / `DATABASE_URL` and apply with `psql` / a small node `pg` script.

## Apply patch (if syncing GitHub `saltmorning`)
```bash
cd saltmorning
git apply saltmorning-patches/0001-Fix-vocab-demote-within-3-day-grace-and-persist-test.patch
```

## Verify
```bash
node server/scripts/test-vocab-promotion.js
curl -s https://mrpark.online/api/health | jq .portalBuild
```
