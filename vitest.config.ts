import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environment: 'jsdom',

    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],

    exclude: ['e2e', 'node_modules', '.next'],
  },
})
