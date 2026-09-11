/* eslint-env node */
const path = require('node:path');

const root = __dirname;

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/steps/**/*.ts', 'src/hooks/**/*.ts', 'src/support/**/*.ts'],
    format: [
      ['html', path.join(root, 'reports/cucumber-report/cucumber-report.html')],
      ['json', path.join(root, 'reports/cucumber-report/cucumber-report.json')],
      'progress',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      resultsDir: path.join(root, 'reports/allure-results'),
      snippetInterface: 'async-await',
    },
    publishQuiet: true,
    parallel: Number(process.env.WORKERS || 1),
    retry: process.env.CI ? 1 : 0,
  },
};
