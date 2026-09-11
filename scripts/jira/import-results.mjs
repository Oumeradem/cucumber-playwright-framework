#!/usr/bin/env node
// =============================================================================
// import-results.mjs - Imports failed scenarios from the Cucumber JSON report
// into Jira as bugs (or updates existing bugs with the same title).
//
// Configuration (env vars):
//   JIRA_BASE_URL  e.g. https://your-domain.atlassian.net
//   JIRA_EMAIL     the API-token owner's email
//   JIRA_API_TOKEN an Atlassian API token
//   JIRA_PROJECT   the Jira project key, e.g. QA
//   JIRA_ISSUE_TYPE  optional, defaults to "Bug"
//
// Usage:
//   node scripts/jira/import-results.mjs [--report <path>] [--dry-run] [--max N]
//
// Requires Node.js >= 18 (global fetch). No npm dependencies.
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const DEFAULT_REPORT = path.join(PROJECT_ROOT, 'reports', 'cucumber-report', 'cucumber-report.json');

const args = process.argv.slice(2);
const reportPath = argValue(args, '--report') ?? DEFAULT_REPORT;
const dryRun = args.includes('--dry-run');
const maxIssues = Number(argValue(args, '--max') ?? '50');

const baseUrl = process.env.JIRA_BASE_URL?.replace(/\/$/, '');
const email = process.env.JIRA_EMAIL;
const apiToken = process.env.JIRA_API_TOKEN;
const projectKey = process.env.JIRA_PROJECT;
const issueType = process.env.JIRA_ISSUE_TYPE ?? 'Bug';

function argValue(argv, name) {
  const idx = argv.indexOf(name);
  return idx >= 0 && argv[idx + 1] ? argv[idx + 1] : undefined;
}

function fail(message) {
  console.error(`[jira:import] ERROR: ${message}`);
  process.exit(1);
}

if (dryRun) console.log('[jira:import] DRY RUN - no issues will be created/updated');
if (!fs.existsSync(reportPath)) fail(`report not found at ${reportPath}`);
if (!dryRun) {
  for (const [name, value] of [['JIRA_BASE_URL', baseUrl], ['JIRA_EMAIL', email], ['JIRA_API_TOKEN', apiToken], ['JIRA_PROJECT', projectKey]]) {
    if (!value) fail(`${name} is required (set it in the environment)`);
  }
}

/** Collects failed scenarios from a Cucumber JSON report. */
function collectFailures(report) {
  const failures = [];
  for (const feature of report) {
    const featureName = feature.name;
    for (const element of feature.elements ?? []) {
      if (element.type !== 'scenario') continue;
      const steps = element.steps ?? [];
      const failedSteps = steps.filter((step) => step.result?.status === 'failed');
      if (failedSteps.length === 0) continue;
      const firstFailure = failedSteps[0];
      failures.push({
        featureName,
        scenarioName: element.name,
        location: element.uri ? `${path.basename(element.uri)}:${element.line ?? ''}` : '',
        step: firstFailure.keyword + (firstFailure.name ?? ''),
        errorMessage: firstFailure.result?.error_message?.split('\n')[0] ?? 'Unknown error',
        tags: (element.tags ?? []).map((t) => t.name),
      });
    }
  }
  return failures;
}

/** Builds a minimal Atlassian Document Format payload from plain text. */
function toAdf(text, kind = 'paragraph') {
  if (kind === 'codeBlock') {
    return { type: 'codeBlock', attrs: { language: 'text' }, content: [{ type: 'text', text: String(text).slice(0, 20000) }] };
  }
  return { type: kind, content: [{ type: 'text', text: String(text) }] };
}

function buildDescriptionBody(failure) {
  const lines = [
    `Feature: ${failure.featureName}`,
    `Scenario: ${failure.scenarioName}`,
    `Location: ${failure.location}`,
    `Failed step: ${failure.step}`,
    '',
    `Tags: ${failure.tags.join(', ') || 'none'}`,
  ];
  return [
    toAdf(lines.join('\n')),
    { type: 'paragraph', content: [] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Failure:' }] },
    toAdf(failure.errorMessage, 'codeBlock'),
  ];
}

async function jiraRequest(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Jira API ${response.status} for ${url}: ${body.slice(0, 500)}`);
  }
  return response.status === 204 ? null : response.json();
}

async function findExistingIssue(summary) {
  const jql = encodeURIComponent(`project = "${projectKey}" AND summary ~ "${summary.slice(0, 60)}" ORDER BY created DESC`);
  const data = await jiraRequest(`${baseUrl}/rest/api/3/search?jql=${jql}&maxResults=1`);
  return data.issues?.[0] ?? null;
}

async function createIssue(failure) {
  const summary = `[Automation] ${failure.scenarioName}`;
  const existing = await findExistingIssue(summary);
  if (existing) {
    console.log(`  = existing issue ${existing.key} found for "${failure.scenarioName}", skipping`);
    return { action: 'skipped', key: existing.key };
  }
  const payload = {
    fields: {
      project: { key: projectKey },
      summary,
      issuetype: { name: issueType },
      labels: [...failure.tags.map((t) => t.replace(/^@/, '').slice(0, 50)), 'automation'],
      description: { type: 'doc', version: 1, content: buildDescriptionBody(failure) },
    },
  };
  const created = await jiraRequest(`${baseUrl}/rest/api/3/issue`, { method: 'POST', body: JSON.stringify(payload) });
  console.log(`  + created ${created.key} for "${failure.scenarioName}"`);
  return { action: 'created', key: created.key };
}

// ---------------------------------------------------------------------------
console.log(`[jira:import] reading report: ${reportPath}`);
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const failures = collectFailures(report).slice(0, maxIssues);
console.log(`[jira:import] found ${failures.length} failed scenario(s)`);

if (failures.length === 0) {
  console.log('[jira:import] nothing to import - all scenarios passed.');
  process.exit(0);
}

if (dryRun) {
  for (const failure of failures) {
    console.log(`  - ${failure.featureName} :: ${failure.scenarioName} :: ${failure.errorMessage}`);
  }
  process.exit(0);
}

let created = 0;
let skipped = 0;
for (const failure of failures) {
  try {
    const result = await createIssue(failure);
    if (result.action === 'created') {
      created++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.error(`  ! failed to import "${failure.scenarioName}": ${error.message}`);
  }
}
console.log(`[jira:import] done: ${created} created, ${skipped} already tracked.`);
process.exit(failures.length - created > 0 ? 1 : 0);

