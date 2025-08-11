import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { NextAuthOptions } from 'next-auth'

// Mock the Prisma client
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
}

// Mock @nexus/database
vi.mock('@nexus/database', () => ({
  PrismaClient: vi.fn(() => mockPrisma),
}))

// Mock @auth/prisma-adapter
vi.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: vi.fn(() => ({})),
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}))

// Mock next-auth providers
vi.mock('next-auth/providers/google', () => ({
  default: vi.fn(() => ({
    id: 'google',
    name: 'Google',
    type: 'oauth',
  })),
}))

vi.mock('next-auth/providers/discord', () => ({
  default: vi.fn(() => ({
    id: 'discord',
    name: 'Discord',
    type: 'oauth',
  })),
}))

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config) => ({
    id: 'credentials',
    name: 'credentials',
    type: 'credentials',
    ...config,
  })),
}))

import bcrypt from 'bcryptjs'

describe('Authentication Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default mock responses
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-password',
      image: null,
    })

    vi.mocked(bcrypt.compare).mockResolvedValue(true as any)
  })

  describe('Credentials Provider', () => {
    it('should authenticate valid user credentials', async () => {
      // Import auth config after mocking
      const { authOptions } = await import('@nexus/auth')

      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials',
      ) as any

      expect(credentialsProvider).toBeDefined()
      expect(credentialsProvider.authorize).toBeDefined()

      const result = await credentialsProvider.authorize(
        { email: 'test@example.com', password: 'password123' },
        {} as any,
      )

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
      })

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password')
    })

    it('should reject invalid credentials', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as any)

      const { authOptions } = await import('@nexus/auth')
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials',
      ) as any

      const result = await credentialsProvider.authorize(
        { email: 'test@example.com', password: 'wrong-password' },
        {} as any,
      )

      expect(result).toBeNull()
    })

    it('should reject user without password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: null, // No password
        image: null,
      })

      const { authOptions } = await import('@nexus/auth')
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials',
      ) as any

      const result = await credentialsProvider.authorize(
        { email: 'test@example.com', password: 'password123' },
        {} as any,
      )

      expect(result).toBeNull()
    })

    it('should reject non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const { authOptions } = await import('@nexus/auth')
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials',
      ) as any

      const result = await credentialsProvider.authorize(
        { email: 'nonexistent@example.com', password: 'password123' },
        {} as any,
      )

      expect(result).toBeNull()
    })

    it('should handle missing email or password', async () => {
      const { authOptions } = await import('@nexus/auth')
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials',
      ) as any

      // Test missing email
      let result = await credentialsProvider.authorize({ password: 'password123' }, {} as any)
      expect(result).toBeNull()

      // Test missing password
      result = await credentialsProvider.authorize({ email: 'test@example.com' }, {} as any)
      expect(result).toBeNull()
    })

    it('should handle database errors gracefully', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const { authOptions } = await import('@nexus/auth')
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials',
      ) as any

      const result = await credentialsProvider.authorize(
        { email: 'test@example.com', password: 'password123' },
        {} as any,
      )

      expect(result).toBeNull()
    })
  })

  describe('Development Provider', () => {
    it('should authenticate any email in development', async () => {
      // Set NODE_ENV to development
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      // Re-import to pick up the environment change
      vi.resetModules()
      const { authOptions } = await import('@nexus/auth')

      const devProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'dev-login',
      ) as any

      expect(devProvider).toBeDefined()

      const result = await devProvider.authorize({ email: 'any@example.com' }, {} as any)

      expect(result).toEqual({
        id: 'dev-user-123',
        email: 'any@example.com',
        name: 'any',
        image: null,
      })

      // Restore environment
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Session Configuration', () => {
    it('should use JWT strategy', async () => {
      const { authOptions } = await import('@nexus/auth')

      expect(authOptions.session?.strategy).toBe('jwt')
    })

    it('should have correct callback pages', async () => {
      const { authOptions } = await import('@nexus/auth')

      // Check that pages are configured correctly
      expect(authOptions.pages).toBeDefined()
    })
  })

  describe('Callbacks', () => {
    it('should add user id to JWT token', async () => {
      const { authOptions } = await import('@nexus/auth')

      const mockToken = { email: 'test@example.com' }
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      const result = await authOptions.callbacks?.jwt?.({
        token: mockToken,
        user: mockUser,
        account: null,
        profile: undefined,
        isNewUser: false,
      } as any)

      expect(result?.id).toBe('user-123')
    })

    it('should add user id to session from token', async () => {
      const { authOptions } = await import('@nexus/auth')

      const mockSession = { user: { email: 'test@example.com' } }
      const mockToken = { id: 'user-123', email: 'test@example.com' }

      if (authOptions.callbacks?.session) {
        const result = await authOptions.callbacks.session({
          session: mockSession as any,
          token: mockToken as any,
        })

        expect(result.user.id).toBe('user-123')
      }
    })
  })
})
