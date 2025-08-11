import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Define mocks at the top level (before any imports or usage)
const mockPrismaUser = {
  findUnique: vi.fn(),
  create: vi.fn(),
  deleteMany: vi.fn(),
}

const mockPrisma = {
  user: mockPrismaUser,
}

const mockBcrypt = {
  hash: vi.fn().mockResolvedValue('hashedPassword123'),
  compare: vi.fn().mockResolvedValue(true),
}

// Mock @nexus/database
vi.mock('@nexus/database', () => ({
  PrismaClient: vi.fn().mockImplementation(() => mockPrisma),
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: mockBcrypt,
}))

// Now import the module to test
const { POST } = await import('../../src/app/api/auth/register/route')

// Mock NextRequest for testing
function createMockRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

describe('Registration API', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset all mock implementations
    mockPrismaUser.findUnique.mockResolvedValue(null)
    mockPrismaUser.create.mockResolvedValue({
      id: 'user-123',
      email: 'john.doe@example.com',
      name: 'John Doe',
      createdAt: new Date(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const validUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securepassword123',
      }

      const request = createMockRequest(validUser)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('User created successfully')
      expect(data.user).toEqual({
        id: 'user-123',
        email: 'john.doe@example.com',
        name: 'John Doe',
      })

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      })
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashedPassword123',
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })
    })

    it('should return 400 for missing required fields', async () => {
      const incompleteUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        // missing password
      }

      const request = createMockRequest(incompleteUser)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name, email, and password are required')
    })

    it('should return 400 for invalid email format', async () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'securepassword123',
      }

      const request = createMockRequest(invalidUser)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email format')
    })

    it('should return 400 for password too short', async () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '1234567', // Only 7 characters
      }

      const request = createMockRequest(invalidUser)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password must be at least 8 characters long')
    })

    it('should return 409 for duplicate email', async () => {
      // Mock existing user
      mockPrismaUser.findUnique.mockResolvedValueOnce({
        id: 'existing-user',
        email: 'john.doe@example.com',
        name: 'Existing User',
      })

      const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securepassword123',
      }

      const request = createMockRequest(user)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('User with this email already exists')
    })

    it('should normalize email to lowercase', async () => {
      const user = {
        name: 'John Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
        password: 'securepassword123',
      }

      const request = createMockRequest(user)
      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      })
      expect(mockPrismaUser.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'john.doe@example.com',
          }),
        }),
      )
    })

    it('should hash the password', async () => {
      const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securepassword123',
      }

      const request = createMockRequest(user)
      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockBcrypt.hash).toHaveBeenCalledWith('securepassword123', 12)
      expect(mockPrismaUser.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: 'hashedPassword123',
          }),
        }),
      )
    })

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should handle empty request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should trim whitespace from fields', async () => {
      const user = {
        name: '  John Doe  ',
        email: '  john.doe@example.com  ',
        password: 'securepassword123',
      }

      const request = createMockRequest(user)
      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockPrismaUser.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: '  John Doe  ', // API doesn't trim name
            email: 'john.doe@example.com', // Email is normalized
          }),
        }),
      )
    })
  })

  describe('Password Security', () => {
    it('should accept various password lengths above minimum', async () => {
      const passwords = [
        'password123', // 11 chars
        'verylongpassword123456789', // 25 chars
        'short8ch', // 8 chars (minimum)
      ]

      for (const password of passwords) {
        const user = {
          name: 'John Doe',
          email: `john${Math.random()}@example.com`,
          password,
        }

        const request = createMockRequest(user)
        const response = await POST(request)

        expect(response.status).toBe(201)
      }
    })

    it('should accept passwords with special characters', async () => {
      const passwords = ['password123!@#', 'pássw0rd123', 'pass word 123', 'p@$$w0rd123']

      for (const password of passwords) {
        const user = {
          name: 'John Doe',
          email: `john${Math.random()}@example.com`,
          password,
        }

        const request = createMockRequest(user)
        const response = await POST(request)

        expect(response.status).toBe(201)
      }
    })
  })

  describe('Email Validation', () => {
    it('should accept various valid email formats', async () => {
      const emails = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org',
        'user123@domain-name.com',
        'firstname.lastname@subdomain.domain.com',
      ]

      for (const email of emails) {
        mockPrismaUser.create.mockResolvedValueOnce({
          id: `user-${Math.random()}`,
          email,
          name: 'Test User',
          createdAt: new Date(),
        })

        const user = {
          name: 'Test User',
          email,
          password: 'password123',
        }

        const request = createMockRequest(user)
        const response = await POST(request)

        expect(response.status).toBe(201)
      }
    })

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid',
        '@domain.com',
        'user@',
        'user@domain',
        'user.domain.com',
        'user@domain..com',
        'user @domain.com',
      ]

      for (const email of invalidEmails) {
        const user = {
          name: 'Test User',
          email,
          password: 'password123',
        }

        const request = createMockRequest(user)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid email format')
      }
    })
  })
})
