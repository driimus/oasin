import { defineConfig } from 'vitest/config';
import tsConfig from './tsconfig.json' with { type: 'json' };

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['jest-extended/all'],
    silent: true,
    coverage: { enabled: true, include: tsConfig.include },
  },
});
