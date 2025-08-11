import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    env: {
      DATABASE_URL: 'file:../../packages/database/prisma/test.db',
      NEXTAUTH_SECRET: 'test-secret',
      NEXTAUTH_URL: 'http://localhost:3000',
      NODE_ENV: 'test',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nexus/database': path.resolve(__dirname, '../../packages/database'),
      '@nexus/auth': path.resolve(__dirname, '../../packages/auth'),
    },
  },
})
