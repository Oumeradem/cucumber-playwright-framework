---
name: git
description: Use Git safely in this repository - Conventional Commits, branch naming, never commit secrets or .env, never push without approval.
---

# Git Skill

## Branch naming

```
feature/<kebab-case>
bugfix/<kebab-case>
test/<kebab-case>
chore/<kebab-case>
```

Never work directly on `main` unless explicitly approved.

## Commits

- Use Conventional Commits: `feat:`, `test:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Always `git status` + `git diff` before committing.
- Stage specific files; never `git add -A` blindly.
- Never commit `.env` or any real credential — run `npm run verify:secrets` first.

## Push / PR

- Never push without explicit approval.
- Never force-push unless explicitly asked.
- Open PRs only after tests pass and the branch is pushed.

## Quality gates before committing

```bash
npm run verify            # lint + format + typecheck
npm run verify:secrets    # secret scan
```
