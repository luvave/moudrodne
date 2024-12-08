import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { prettierConfig } from '@moudrodne/prettier-config';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  {
    files: ['**/*.{js,cjs,ts,jsx,tsx}'],
  },
  {
    ignores: ['**/*.config.ts', '**/*.config.js', '**/dist', '**/node_modules', '**/scripts', 'tsconfig.json'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  prettierRecommended,
  {
    ignores: ['dist/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-console': 'warn',
      'prettier/prettier': ['warn', prettierConfig],
    },
  },
];
