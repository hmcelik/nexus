import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@nexus/database'
import path from 'path'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
  NextAuth: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: vi.fn(() => ({
    data: {
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      expires: '1',
    },
    status: 'authenticated',
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Initialize test database
let testPrisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var testPrisma: PrismaClient | undefined
}

beforeAll(async () => {
  // Set test database URL with absolute path
  const testDbPath = path.resolve(__dirname, '../../packages/database/prisma/test.db')
  process.env.DATABASE_URL = `file:${testDbPath}`

  testPrisma = new PrismaClient()
  await testPrisma.$connect()

  global.testPrisma = testPrisma
})

beforeEach(async () => {
  // Clean up before each test - clean all tables used in tests
  if (testPrisma) {
    try {
      await testPrisma.user.deleteMany()
      await testPrisma.account.deleteMany()
      await testPrisma.session.deleteMany()
      await testPrisma.bot.deleteMany()
      await testPrisma.plugin.deleteMany()
    } catch (error) {
      // Ignore cleanup errors
      console.warn('Test cleanup warning:', error)
    }
  }
})

afterAll(async () => {
  if (testPrisma) {
    await testPrisma.$disconnect()
  }
})
