/**
 * Summarize the Cucumber JSON report.
 *
 * Reads the JSON report written by the `json` Cucumber formatter (see
 * cucumber.js) and prints a concise human-readable summary, including a list
 * of any failing scenarios and the step that failed.
 *
 *   npm run report:cucumber
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPORT_PATH = path.resolve(__dirname, '../reports/cucumber-report/cucumber-report.json');

const STATUS = ['passed', 'failed', 'skipped', 'pending', 'undefined', 'ambiguous'];

if (!fs.existsSync(REPORT_PATH)) {
  console.error(`[summarize] No report found at ${REPORT_PATH}`);
  console.error('[summarize] Run the suite first (e.g. `npm test`) to generate it.');
  process.exit(1);
}

let features;
try {
  features = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
} catch (error) {
  console.error(`[summarize] Failed to parse report JSON: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(features)) {
  console.error('[summarize] Unexpected report format: expected an array of features.');
  process.exit(1);
}

const totals = { feature: 0, scenario: 0, step: 0 };
const byStatus = Object.fromEntries(STATUS.map((s) => [s, 0]));
const failures = [];

for (const feature of features) {
  totals.feature += 1;
  const elements = feature.elements || [];
  for (const scenario of elements) {
    totals.scenario += 1;
    const steps = scenario.steps || [];
    let scenarioStatus = 'passed';
    for (const step of steps) {
      totals.step += 1;
      const status = step.result ? step.result.status : 'skipped';
      byStatus[status] = (byStatus[status] || 0) + 1;
      if (status === 'failed') {
        scenarioStatus = 'failed';
        failures.push({
          scenario: scenario.name || '(untitled)',
          feature: feature.name || '(untitled)',
          keyword: step.keyword,
          step: step.name,
          message: step.result.error_message || '',
        });
      }
    }
    if (scenarioStatus !== 'passed' && !steps.some((s) => s.result && s.result.status === 'failed')) {
      // A scenario whose final step never ran (e.g. hook failure).
      scenarioStatus = 'skipped';
    }
    byStatus[`scenario:${scenarioStatus}`] = (byStatus[`scenario:${scenarioStatus}`] || 0) + 1;
  }
}

console.log('============================================================');
console.log('Cucumber report summary');
console.log('============================================================');
console.log(`Features   : ${totals.feature}`);
console.log(`Scenarios  : ${totals.scenario}`);
console.log(`Steps      : ${totals.step}`);
console.log('------------------------------------------------------------');
console.log(
  `Scenario status : passed=${byStatus['scenario:passed'] || 0} failed=${byStatus['scenario:failed'] || 0} skipped=${byStatus['scenario:skipped'] || 0}`,
);
console.log(`Step status     : ${STATUS.map((s) => `${s}=${byStatus[s] || 0}`).join('  ')}`);
console.log('============================================================');

if (failures.length > 0) {
  console.log(`\n${failures.length} failing step(s):\n`);
  for (const f of failures) {
    console.log(`  [FAILED] ${f.keyword}${f.step}  (scenario: "${f.scenario}")`);
    const firstLines = f.message.split('\n').slice(0, 6);
    for (const line of firstLines) {
      console.log(`      ${line}`);
    }
    console.log('');
  }
  process.exitCode = 1;
} else {
  console.log('\nAll scenarios passed. ✓');
}
