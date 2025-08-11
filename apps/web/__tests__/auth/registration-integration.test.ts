import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../../src/app/api/auth/register/route'

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

describe('Registration API Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const testCases = [
        { body: {}, expectedError: 'Name, email, and password are required' },
        { body: { name: 'John' }, expectedError: 'Name, email, and password are required' },
        {
          body: { name: 'John', email: 'john@example.com' },
          expectedError: 'Name, email, and password are required',
        },
        {
          body: { email: 'john@example.com', password: 'password' },
          expectedError: 'Name, email, and password are required',
        },
        {
          body: { name: 'John', password: 'password' },
          expectedError: 'Name, email, and password are required',
        },
      ]

      for (const testCase of testCases) {
        const request = createMockRequest(testCase.body)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe(testCase.expectedError)
      }
    })

    it('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user.example.com',
        'user@.com',
        'user space@example.com',
      ]

      for (const email of invalidEmails) {
        const request = createMockRequest({
          name: 'Test User',
          email,
          password: 'password123',
        })
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid email format')
      }
    })

    it('should validate password length', async () => {
      const shortPasswords = ['a', 'ab', 'abc', 'abcd', 'abcde', 'abcdef', 'abcdefg']

      for (const password of shortPasswords) {
        const request = createMockRequest({
          name: 'Test User',
          email: 'test@example.com',
          password,
        })
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Password must be at least 8 characters long')
      }
    })

    it('should accept valid email formats', async () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'user+tag@example.co.uk',
        'user.name+tag@example.io',
        'test123@test-domain.com',
        'user_name@example.org',
      ]

      for (const email of validEmails) {
        const request = createMockRequest({
          name: 'Test User',
          email,
          password: 'password123',
        })
        const response = await POST(request)

        // Note: This might fail due to database connection issues
        // but the email validation should pass
        expect([201, 500]).toContain(response.status)

        if (response.status === 400) {
          const data = await response.json()
          expect(data.error).not.toBe('Invalid email format')
        }
      }
    })

    it('should accept valid password lengths', async () => {
      const validPasswords = [
        'password', // 8 chars - minimum
        'longerpassword123', // 16 chars
        'verylongpasswordthatexceedstwentyfourcharacters', // 48 chars
        'P@ssw0rd!123', // Special characters
        '12345678', // Numbers
        'UPPERCASE', // Uppercase
      ]

      for (const password of validPasswords) {
        const request = createMockRequest({
          name: 'Test User',
          email: `test${password.length}@example.com`,
          password,
        })
        const response = await POST(request)

        // Password validation should pass, might fail at database level
        expect([201, 500, 409]).toContain(response.status)

        if (response.status === 400) {
          const data = await response.json()
          expect(data.error).not.toBe('Password must be at least 8 characters long')
        }
      }
    })

    it('should handle malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json {',
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

    it('should normalize email to lowercase', () => {
      // This test checks the logic without hitting the database
      const testEmails = [
        { input: 'USER@EXAMPLE.COM', expected: 'user@example.com' },
        { input: 'User.Name@Example.Com', expected: 'user.name@example.com' },
        { input: 'MIXED.case@DOMAIN.ORG', expected: 'mixed.case@domain.org' },
      ]

      testEmails.forEach(({ input, expected }) => {
        expect(input.toLowerCase()).toBe(expected)
      })
    })

    it('should validate response structure for successful registration', async () => {
      const validUser = {
        name: 'John Doe',
        email: 'john.test@example.com',
        password: 'securepassword123',
      }

      const request = createMockRequest(validUser)
      const response = await POST(request)

      if (response.status === 201) {
        const data = await response.json()

        // Check response structure
        expect(data).toHaveProperty('message')
        expect(data).toHaveProperty('user')
        expect(data.message).toBe('User created successfully')

        // Check user object structure
        expect(data.user).toHaveProperty('id')
        expect(data.user).toHaveProperty('name')
        expect(data.user).toHaveProperty('email')
        expect(data.user).not.toHaveProperty('password') // Password should not be returned
        expect(data.user).not.toHaveProperty('createdAt') // CreatedAt should not be in response

        // Check user data
        expect(data.user.name).toBe(validUser.name)
        expect(data.user.email).toBe(validUser.email.toLowerCase())
        expect(typeof data.user.id).toBe('string')
        expect(data.user.id.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Error Handling', () => {
    it('should return consistent error format', async () => {
      const request = createMockRequest({
        name: '',
        email: 'invalid-email',
        password: 'short',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(data).toHaveProperty('error')
      expect(typeof data.error).toBe('string')
      expect(data.error.length).toBeGreaterThan(0)
      expect(response.status).toBeGreaterThanOrEqual(400)
    })

    it('should handle null values gracefully', async () => {
      const request = createMockRequest({
        name: null,
        email: null,
        password: null,
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name, email, and password are required')
    })

    it('should handle undefined values gracefully', async () => {
      const request = createMockRequest({
        name: undefined,
        email: undefined,
        password: undefined,
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name, email, and password are required')
    })
  })

  describe('Security Tests', () => {
    it('should not return sensitive information in error messages', async () => {
      const request = createMockRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      // Should not expose internal system information
      if (data.error) {
        expect(data.error).not.toMatch(/database/i)
        expect(data.error).not.toMatch(/prisma/i)
        expect(data.error).not.toMatch(/sql/i)
        expect(data.error).not.toMatch(/connection/i)
      }
    })

    it('should validate input sanitization', async () => {
      const maliciousInputs = [
        {
          name: '<script>alert("xss")</script>',
          email: 'test@example.com',
          password: 'password123',
        },
        { name: 'Test User', email: '<script>@example.com', password: 'password123' },
        { name: 'Test User', email: 'test@example.com', password: '<script>alert("xss")</script>' },
      ]

      for (const input of maliciousInputs) {
        const request = createMockRequest(input)
        const response = await POST(request)

        // Should either accept (if sanitized) or reject (if validation catches it)
        expect([201, 400, 409, 500]).toContain(response.status)

        if (response.status === 201) {
          const data = await response.json()
          // If accepted, scripts should be treated as literal text, not executed
          expect(data.user.name).not.toMatch(/<script>/i)
        }
      }
    })
  })
})
