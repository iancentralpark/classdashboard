# Vocab Booster demote / attempt-log fix (for `saltmorning`)

This agent cannot push to `iancentralpark/saltmorning` (403). Apply this patch there and deploy.

## What was wrong
1. **Arthur** demoted after **1 idle day** — inactivity decay ignored the **3-day grace**.
2. **Jei** had `testAttempts: 2` / last score **70% (7/10)** but **no per-attempt rows** and **no `vocab_set` activity** — only the last `test_score` was kept, and failed/non-reward submits were not logged.
3. Score math: `delta = (correct - total/2) * 3` → **7/10 = +6**. A 70% test must not demote by itself. Jei’s demote was a separate false inactivity/login demote; afterward +6 explains promo **396** (= 390 re-entry + 6).
4. `todayStr()` used server **UTC** date on Railway → idle-day / quest_date skew vs Seoul.

## Immediate data repair (already done on production via teacher API)
- Jei → **Emerald (G7)** (placement kept)
- Arthur → **Silver (G4)** (placement kept)
- Note: override reset their promotion scores to **0** (prod override behavior).

## Apply
```bash
cd saltmorning
git apply saltmorning-patches/0001-Fix-vocab-demote-within-3-day-grace-and-persist-test.patch
# or: git am < the.patch
# Run migration 019_vocab_promotion_ladder.sql on Supabase
# Deploy Railway
```

## Verify
```bash
node server/scripts/test-vocab-promotion.js
```
