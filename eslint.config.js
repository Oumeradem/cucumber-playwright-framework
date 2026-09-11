/* eslint-env node */
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'reports/**',
      'allure-results/**',
      'allure-report/**',
      'playwright-report/**',
      'screenshots/**',
      'videos/**',
      'traces/**',
      '.env',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  {
    files: ['scripts/**/*.js', 'cucumber.js', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
);
