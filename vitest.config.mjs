import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['jest-extended/all'],
    silent: true,
    coverage: {
      provider: 'v8',
      exclude: ['tests/fixtures'],
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
});
