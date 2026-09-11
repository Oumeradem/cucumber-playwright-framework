#!/usr/bin/env node
// =============================================================================
// update-status.mjs - Transitions a Jira issue to a target status using the
// issue's available transitions. Used by the Jira status agent to reflect
// automation results back into the tracker.
//
// Configuration (env vars): JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN
//
// Usage:
//   node scripts/jira/update-status.mjs <ISSUE_KEY> <TARGET_STATUS>
//   node scripts/jira/update-status.mjs QA-123 "In Progress"
//
// Requires Node.js >= 18 (global fetch). No npm dependencies.
// =============================================================================
import process from 'node:process';

const [issueKey, targetStatus] = process.argv.slice(2);

const baseUrl = process.env.JIRA_BASE_URL?.replace(/\/$/, '');
const email = process.env.JIRA_EMAIL;
const apiToken = process.env.JIRA_API_TOKEN;

function fail(message) {
  console.error(`[jira:status] ERROR: ${message}`);
  process.exit(1);
}

if (!issueKey || !targetStatus) {
  fail('usage: node scripts/jira/update-status.mjs <ISSUE_KEY> <TARGET_STATUS>');
}
for (const [name, value] of [['JIRA_BASE_URL', baseUrl], ['JIRA_EMAIL', email], ['JIRA_API_TOKEN', apiToken]]) {
  if (!value) fail(`${name} is required (set it in the environment)`);
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

const transitionsUrl = `${baseUrl}/rest/api/3/issue/${issueKey}/transitions?expand=transitions.fields`;
const { transitions } = await jiraRequest(transitionsUrl);
const match = (transitions ?? []).find((t) => t.name.toLowerCase() === targetStatus.toLowerCase());

if (!match) {
  console.error(`[jira:status] issue ${issueKey} has no transition to "${targetStatus}". Available:`);
  for (const t of transitions ?? []) console.error(`  - ${t.name}`);
  fail('no matching transition found');
}

await jiraRequest(transitionsUrl, {
  method: 'POST',
  body: JSON.stringify({ transition: { id: match.id } }),
});
console.log(`[jira:status] ${issueKey} -> ${match.name} (transition id ${match.id})`);
