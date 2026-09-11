# Environment Rules

- Multi-environment support: `dev`, `qa`, `stage`, `prod` (configs in `src/config/environments/`).
- Select the environment at runtime: `ENV=qa npm test`, `ENV=stage npm test`.
- Never hardcode URLs — always go through `config.baseUrl` (and page paths).
- Central config (`src/config/config.ts`) is the only place that reads environment variables (via dotenv + `process.env` fallbacks).
- `.env` holds local secrets and is git-ignored; `.env.example` has placeholders only.
- CI/CD injects real values via secrets (GitHub Secrets, Jenkins Credentials); see `scripts/ci/prepare-env.sh`.
- Browser, headless, workers, timeout, trace, screenshot, and video are all config-driven:
  `BROWSER=firefox npx cucumber-js`, `HEADLESS=false npm run test:headed`, `WORKERS=4 npx cucumber-js`.
- Defaults: retries CI=1 / local=0; trace `on-first-retry`; screenshot `only-on-failure`.
