import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import prettierConfig from './prettier.config.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,cjs,ts,jsx,tsx}'],
  },
  {
    ignores: ['**/*.config.mts', '**/*.config.mjs', '**/dist', '**/node_modules', '**/scripts', 'tsconfig.json'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['warn', prettierConfig],
    },
  },
];
