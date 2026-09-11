# Security Rules

- Credentials MUST NEVER be hardcoded in source code, feature files, reports, logs, or agent prompts.
- Real secrets live only in git-ignored `.env` or CI secret stores (GitHub Secrets, Jenkins Credentials).
- `.env.example` contains placeholders only and is the only committed environment template.
- Never commit `.env`; before committing, run `npm run verify:secrets` (scans git-tracked files for high-confidence secret patterns).
- Never print passwords/tokens to console or logs; redact them.
- Reports can contain URLs and error text — never embed credentials there.
- If a secret leaks, alert the user immediately (rotate + scrub history) — do not silently continue.
