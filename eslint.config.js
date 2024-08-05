import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import vitest from 'eslint-plugin-vitest';
import tsEslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';

export default tsEslint.config(
  {
    ignores: ['dist', 'coverage', 'tests/fixtures', '*.d.ts', '*.config.{js,ts}'],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
    },
  },
  unicorn.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: {
      'prefer-const': ['error', { destructuring: 'all' }],
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'warn',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-switch-case': 'error',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksConditionals: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  prettier,
);
