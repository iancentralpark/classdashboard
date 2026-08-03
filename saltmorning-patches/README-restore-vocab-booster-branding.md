# Restore Vocab Booster branding (redeploy wipe)

portalBuild **2026-08-02.01**

## Why it rolled back
Live `2026-07-31.26` already had:
- Student card/nav: **Vocab Booster** / **Booster**
- Buddy nav: two-line **Virtual / Mr. Park** (`.mobile-nav-label-2line`)
- Teacher buttons/modals: **Vocab Booster**

Those strings were **deployed via local `railway up` but never committed to GitHub**.

On **2026-08-01 ~07:43 UTC**, cloud-agent `railway up` from the older git tree ran `build-public.js`, which recopied root `Student.html` / `Index.html` (still saying Words / AI Buddy / Vocab LMS) over `server/public/*` and wiped the live branding.

Evidence: `/tmp/live_student.html` / `/tmp/live_teacher.html` curled at 2026-08-01 03:17 UTC while live was still `.26`.

## Also in this patch
- Vocab Booster card is **vocab tab only** (no longer duplicated on Home)

## Apply
```bash
cd saltmorning
git apply saltmorning-patches/0008-Restore-vocab-booster-branding-after-redeploy-wipe.patch
```
