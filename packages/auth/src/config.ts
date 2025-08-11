import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import './types' // Import type declarations

// Make environment validation optional for development
function getEnvVar(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue
}

const NEXTAUTH_URL = getEnvVar('NEXTAUTH_URL', 'http://localhost:3000')
const NEXTAUTH_SECRET = getEnvVar(
  'NEXTAUTH_SECRET',
  process.env.NODE_ENV === 'development' ? 'dev-secret-key-for-local' : undefined,
)
const DATABASE_URL = getEnvVar('DATABASE_URL', 'file:./dev.db')

// Only require secret for actual production deployment
if (!NEXTAUTH_SECRET && process.env.VERCEL_ENV === 'production') {
  throw new Error('NEXTAUTH_SECRET is required in production')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: NEXTAUTH_SECRET,
  providers: [
    // Google OAuth Provider
    ...(getEnvVar('GOOGLE_CLIENT_ID') && getEnvVar('GOOGLE_CLIENT_SECRET')
      ? [
          GoogleProvider({
            clientId: getEnvVar('GOOGLE_CLIENT_ID')!,
            clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET')!,
          }),
        ]
      : []),

    // Email and Password Credentials Provider
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Your password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) return null

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)

          if (!isValidPassword) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          // Use proper logging instead of console
          return null
        }
      },
    }),

    // Development provider (for testing)
    ...(process.env.NODE_ENV === 'development'
      ? [
          CredentialsProvider({
            id: 'dev-login',
            name: 'Development Login',
            credentials: {
              email: { label: 'Email', type: 'email', placeholder: 'any-email@example.com' },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null

              return {
                id: 'dev-user-123',
                email: credentials.email,
                name: credentials.email.split('@')[0],
                image: null,
              }
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
}

// Export auth configuration for Next.js app directory
export { authOptions as default }
