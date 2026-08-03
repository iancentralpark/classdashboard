# Merge: cloud portal fixes + Mr.Park.APP morning-class

portalBuild **2026-08-03.10**

## What this is
- **Kept**: today's `morning-class/` work on `main` (Vocab Booster port, English Buddy resize, student portal, etc.)
- **Restored**: this cloud conversation's `Index.html` / `Student.html` / `server/` fixes for `mrpark.online`

No file-path conflicts — different directories.

## Apply
```bash
cd saltmorning
git checkout main
git merge cursor/merge-app-and-cloud-fixes-a98f
# or: git apply saltmorning-patches/0011-...  (large; prefer merge)
```

## Deploy note
`railway up` from `server/` only updates mrpark.online. It does **not** delete `morning-class/`.
