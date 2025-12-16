'use strict';

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'coverage/**',
      'out/**',
      'ejs.js',
      'ejs.min.js',
      'node_modules/**',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'linebreak-style': ['error', 'unix'],
      'no-trailing-spaces': 'error',
      'indent': ['error', 2],
      'quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      'semi': ['error', 'always'],
      'comma-style': ['error', 'last'],
      'one-var': ['error', 'never'],
      'no-console': 'off',
      'no-useless-escape': 'off',
    },
  },
];
