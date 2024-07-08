import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['jest-extended/all'],
    silent: true,
    coverage: { enabled: true },
  },
});
