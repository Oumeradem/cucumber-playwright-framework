# Git Rules

- Work on topic branches: `feature/`, `bugfix/`, `test/`, `chore/` — never directly on `main` without explicit approval.
- Use Conventional Commits: `feat:`, `test:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Always inspect `git status` and `git diff` before committing; never commit blindly.
- Stage only intended files — never `git add -A` without review.
- NEVER commit `.env`, real credentials, secrets, `node_modules/`, `reports/`, `allure-results/`, `screenshots/`, `videos/`, `traces/`, or `dist/`.
- Run `npm run verify` and `npm run verify:secrets` before committing.
- Never push or open a PR without explicit user approval.
- Never force-push unless explicitly asked.
