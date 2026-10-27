import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**'],
  },
  {
    ...js.configs.recommended,
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
        varsIgnorePattern: '^_',
      }],
    },
  },
];
