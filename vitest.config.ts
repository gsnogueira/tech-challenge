import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['app/**/*.test.ts', 'app/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});