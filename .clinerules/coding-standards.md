# Coding Standards

- TypeScript strict mode is enabled; code must pass `npm run typecheck` (`tsc --noEmit`).
- Use `interface` for object shapes and `type` for unions; prefer readonly fields where possible.
- Use `override` when overriding a base-class member (`noImplicitOverride`).
- Methods and fields: `camelCase`; classes/types: `PascalCase`; feature/step files: `kebab-case`.
- Code must pass `npm run lint` (ESLint) and `npm run format:check` (Prettier).
- No `any` without justification (warned); avoid non-null assertions.
- No arbitrary `waitForTimeout` — rely on Playwright auto-waiting and assertions.
- No hardcoded credentials, URLs, or magic values — use `config`.
- Keep functions small and single-purpose; name things by intent.
- Never disable assertions, delete tests, or hide failures to make the suite pass.
- Run `npm run verify` before finishing any coding task.
