# Teacher mobile UI cleanup (dark mode / Switch / Max sets)

portalBuild **2026-08-01.08**

## Fixes
1. Dark mode: messenger, leave attendance cards, Show all scores, Virtual Mr. Park alert modal
2. Removed student-detail Attendance records day cards (edit on the attendance date instead)
3. Removed Vocab Monitor Settings → Max sets / day; server no longer caps daily sets
4. Mobile: hide Manage Classes under Choose a class (keep Admin Tools entry)
5. Switch class picker no longer leaves Admin tools / Select date / homework panels visible underneath

## Apply
```bash
cd saltmorning
git apply saltmorning-patches/0006-Fix-teacher-mobile-dark-mode-switch-cleanup.patch
```

## Verify
```bash
curl -s https://mrpark.online/api/health | jq .portalBuild
# expect "2026-08-01.08"
```
