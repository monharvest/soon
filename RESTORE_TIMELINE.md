# Restore Timeline

This file captures the recent commit history and safe restore commands for this repository. Use the commands below to create backups, revert changes, or restore to a previous state.

---

## Recent commits (most recent first)

- **f194914** — 2025-10-16 21:27:07 +0200 — chore(a11y): add aria-labels to icon buttons; increase contrast for 'Мөнх үгийн ойлголт' badges
  - Files changed: `admin-ui-frontend/index.html`, `app/post/[slug]/page.tsx`, `components/articles-grid.tsx`, `components/header.tsx`, `components/hero-section.tsx`, `components/toggle-theme.tsx`, `next.config.mjs`

- **249e0a2** — 2025-10-16 17:40:09 +0200 — Fix Next.js 15 params awaiting issue and ReactMarkdown component types
  - Files changed: `app/post/[slug]/page.tsx`

- **2f7218d** — 2025-10-16 17:33:21 +0200 — Update dependencies and fix import issues
  - Files changed: `admin-ui-frontend/index.html`, `admin-worker-backend/...`, `app/post/[slug]/page.tsx`, `lib/cloudflare-kv.ts`, `package-lock.json`, `package.json`

- **67950f8** — 2025-10-16 13:57:41 +0200 — feat: Add category, excerpt, and full KV schema support to admin UI
  - Files changed: `admin-ui-frontend/index.html`

- **6cb71d4** — 2025-10-16 02:17:17 +0200 — Update next.config.mjs for dev compatibility and add admin UI/backend
  - Files changed: `admin-ui-frontend/*`, `admin-worker-backend/*`, `next.config.mjs`

- **e9799f6** — 2025-10-15 23:15:01 +0200 — Update page.tsx
  - Files changed: `app/page.tsx`

- **1a5f3ef** — 2025-10-15 22:31:52 +0200 — Update article card and remove unused images
  - Files changed: `components/article-card.tsx`, `public/*`

- **159ebff** — 2025-10-15 22:22:57 +0200 — Initial commit
  - Files changed: (project root)

---

## Backup created

- Backup branch created at current HEAD:

```bash
git switch -c backup-before-20251016T212800Z
```

This branch points to commit `f194914` (the current HEAD when the backup was created).

---

## Safe restore options (pick one)

1) Create a lightweight restore branch at a past commit (non-destructive)

```bash
# create a branch at commit 2f7218d for testing
git fetch origin
git switch -c main-at-2f7218d 2f7218d
```

2) Revert a single commit (safe, non-destructive — creates a new commit that undoes changes)

```bash
# revert the last commit f194914
git switch main
git revert --no-edit f194914
```

3) Hard-reset local `main` to a specific commit (destructive — discards changes in working tree)

```bash
# WARNING: destructive. Use only if you want local main to match the commit exactly
git switch main
git reset --hard 2f7218d
```

4) Reset local `main` to match remote `origin/main` (synchronize with remote)

```bash
git fetch origin
git switch main
git reset --hard origin/main
```

5) Restore specific files from a past commit

```bash
# restore only specific files from 2f7218d into your working tree
git checkout 2f7218d -- path/to/file1 path/to/file2
# stage and commit them
git add path/to/file1 path/to/file2
git commit -m "chore: restore specific files from 2f7218d"
```

6) Push the backup branch to remote (optional)

```bash
git push origin backup-before-20251016T212800Z
```

---

## Recommendations

- I recommend creating the backup branch (already created) before destructive operations. You can safely experiment by creating `main-at-<hash>` branches and verifying the app locally.
- If you only want to undo the most recent commit, `git revert` is the safest option because it preserves history.
- If you want me to perform any of the above commands for you (create the restore branch, revert the last commit, or hard-reset main), tell me which one and I will run it.

---

Generated on 2025-10-16T21:28:00Z
