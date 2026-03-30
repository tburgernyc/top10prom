import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', '.next/', 'tests/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'motion/react': path.resolve(__dirname, 'tests/__mocks__/motion-react.tsx'),
    },
  },
})
