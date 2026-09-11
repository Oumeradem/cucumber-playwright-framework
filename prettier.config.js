/* eslint-env node */
/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  endOfLine: 'lf',
  arrowParens: 'always',
  overrides: [
    {
      // Gherkin files are formatted by convention, not Prettier (also excluded
      // via .prettierignore). Explicitly disabling the parser keeps Prettier
      // from attempting to parse them if they are ever passed explicitly.
      files: ['*.feature'],
      options: {
        parser: undefined,
      },
    },
  ],
};
