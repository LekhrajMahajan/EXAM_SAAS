// eslint.config.js  (ESLint flat config — ESLint 9+)
import js from '@eslint/js'
import globals from 'globals'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist', 'node_modules', 'public'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // React
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',

      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      // Disable base no-undef in favour of TS (TS handles this better)
      'no-undef': 'off',
    },
  },
  // Config files — allow Node globals
  {
    files: ['*.config.{js,ts}', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettierConfig,
]
