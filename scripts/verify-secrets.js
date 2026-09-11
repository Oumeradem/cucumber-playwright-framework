/**
 * Verify the repository is not leaking secrets.
 *
 * Checks that:
 *   1. `.env` exists and is listed in `.gitignore` (so credentials can't be
 *      committed accidentally).
 *   2. `.env` defines the variables required for the configured environment.
 *   3. No tracked file contains high-confidence secret material (private keys,
 *      cloud access keys, API tokens, etc.).
 *
 * Run locally or in CI before committing:
 *
 *   npm run verify:secrets
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

const root = path.resolve(__dirname, '..');
const envFile = path.join(root, '.env');
const gitignoreFile = path.join(root, '.gitignore');

const problems = [];
const warnings = [];

// ---------------------------------------------------------------------------
// 1. .env must exist and be git-ignored
// ---------------------------------------------------------------------------
if (!fs.existsSync(envFile)) {
  problems.push('.env file is missing. Copy .env.example to .env and fill in the values.');
} else {
  console.log('[verify-secrets] .env found.');
}

if (!fs.existsSync(gitignoreFile)) {
  problems.push('.gitignore file is missing — add ".env" to it.');
} else {
  const gitignoreLines = fs.readFileSync(gitignoreFile, 'utf8').split('\n');
  const ignoresEnv =
    gitignoreLines.some((line) => /^\s*\.env(\.\*)?\s*$/.test(line) || /^\s*\.env\*/.test(line)) ||
    gitignoreLines.some((line) => /^\s*\*\s*$/.test(line));
  const reIncludesEnv =
    gitignoreLines.some((line) => /^!\.env(\.\*)?\s*$/.test(line)) &&
    !gitignoreLines.some((line) => /^\s*\.env(\.\*)?\s*$/.test(line));
  if (!ignoresEnv) {
    problems.push('.env is NOT listed in .gitignore — credentials could be committed.');
  } else if (reIncludesEnv) {
    problems.push('.gitignore re-includes .env via "!.env" while also ignoring it — credentials could be committed.');
  } else {
    console.log('[verify-secrets] .env is listed in .gitignore.');
  }
}

// ---------------------------------------------------------------------------
// 2. Required environment variables
// ---------------------------------------------------------------------------
if (fs.existsSync(envFile)) {
  const parsed = dotenv.parse(fs.readFileSync(envFile, 'utf8'));
  const supportedEnvs = ['dev', 'qa', 'stage', 'prod'];
  const env = (parsed.ENV || 'dev').toLowerCase();
  if (!supportedEnvs.includes(env)) {
    problems.push(`ENV is "${parsed.ENV}" but must be one of: ${supportedEnvs.join(', ')}.`);
  } else {
    console.log(`[verify-secrets] target environment: ${env}`);
  }

  // USERNAME / PASSWORD are required to run the app suite against Saucedemo.
  // Real environments should source these from a secret manager / CI secrets,
  // never hard-code them in tracked files.
  if (!parsed.USERNAME) {
    warnings.push('USERNAME is empty in .env.');
  }
  if (!parsed.PASSWORD) {
    warnings.push('PASSWORD is empty in .env.');
  }

  // Sanity check: flag passwords that look like real secrets rather than the
  // well-known demo credentials used by this framework.
  const demoPasswords = new Set(['secret_sauce', 'change-me', 'changeme']);
  if (parsed.PASSWORD && !demoPasswords.has(parsed.PASSWORD)) {
    warnings.push(
      'PASSWORD in .env does not look like a demo credential. If this is a real secret, move it to a secret manager / CI secret.',
    );
  }
}

// ---------------------------------------------------------------------------
// 3. Scan tracked files for high-confidence secret material
// ---------------------------------------------------------------------------
const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'reports',
  'allure-results',
  'allure-report',
  'playwright-report',
  'test-results',
  'screenshots',
  'videos',
  'traces',
  '.github',
]);
const EXCLUDE_FILES = new Set(['.env', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);

// High-confidence patterns: these are unambiguous secret markers.
const SECRET_PATTERNS = [
  { name: 'private key block', re: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY/i },
  { name: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'AWS secret key', re: /\b(?:aws)?_?secret\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i },
  { name: 'Stripe live key', re: /\bsk_live_[A-Za-z0-9]{16,}\b/ },
  { name: 'GitHub token', re: /\bghp_[A-Za-z0-9]{36}\b/ },
  { name: 'GitHub fine-grained token', re: /\bgithub_pat_[A-Za-z0-9_]{22,}\b/ },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  {
    name: 'generic secret in code',
    re: /(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[=:]\s*['"][^'"]{12,}['"]/i,
  },
];

function walk(dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        results.push(...walk(full));
      }
    } else if (entry.isFile() && !EXCLUDE_FILES.has(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(root);
let scanned = 0;
for (const file of files) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    continue; // e.g. binary files
  }
  if (!content) continue;
  scanned += 1;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.re.test(line)) {
        problems.push(`Potential ${pattern.name} in ${path.relative(root, file)}:${i + 1}`);
      }
    }
  }
}
console.log(`[verify-secrets] scanned ${scanned} tracked source/config files.`);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('');
for (const warning of warnings) {
  console.warn(`[verify-secrets] WARNING: ${warning}`);
}
console.log('');

if (problems.length > 0) {
  console.error('[verify-secrets] FAILED:');
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  console.error('');
  console.error('[verify-secrets] Resolve the issues above before committing.');
  process.exit(1);
}

console.log('[verify-secrets] OK — no secrets detected. ✓');
