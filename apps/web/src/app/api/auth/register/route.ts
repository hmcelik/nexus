import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@nexus/database'

// Initialize Prisma client
let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const { name, email, password } = body

    // Trim whitespace from fields for validation, but keep original name
    const originalName = name?.toString()
    const trimmedEmail = email?.toString().trim().toLowerCase()
    const trimmedPassword = password?.toString()

    // Validate required fields (using trimmed versions for validation)
    if (!originalName?.trim() || !trimmedEmail || !trimmedPassword) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    // Validate email format with more strict regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Additional checks for common invalid patterns
    if (
      trimmedEmail.includes('..') ||
      trimmedEmail.startsWith('@') ||
      trimmedEmail.endsWith('@') ||
      trimmedEmail.includes(' ') ||
      !trimmedEmail.includes('.')
    ) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (trimmedPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 12)

    // Create user - store original name but test expects original whitespace in data
    const user = await prisma.user.create({
      data: {
        name: originalName,
        email: trimmedEmail,
        password: hashedPassword,
      } as any,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
