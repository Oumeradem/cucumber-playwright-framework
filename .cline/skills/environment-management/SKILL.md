---
name: environment-management
description: Manage multi-environment configuration (dev/qa/stage/prod), credentials via .env, and run the suite against a chosen environment.
---

# Environment Management Skill

## Configuration layer

- Central config: `src/config/config.ts` reads `process.env` once via dotenv.
- Per-environment config: `src/config/environments/{dev,qa,stage,prod}.ts` define `baseUrl` and metadata.
- Never access `process.env` directly in pages/steps — use the `config` object.

## Selecting an environment

```bash
ENV=qa npm test
ENV=stage npm test
ENV=dev npm test
```

## Credentials

- Never hardcode credentials. Put them in local `.env` (git-ignored).
- `.env.example` holds placeholders and is safe to commit.
- CI/CD injects real values via GitHub Secrets / Jenkins Credentials (see `scripts/ci/prepare-env.sh`).

## Browser / runtime

```bash
BROWSER=chromium npx cucumber-js
HEADLESS=false npm run test:headed
WORKERS=4 npx cucumber-js
```

## Safety

- Run `npm run verify:secrets` to confirm no secrets are tracked by git.
- Never commit a real `.env`.
