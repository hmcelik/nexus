import { z } from 'zod'

export const authEnvSchema = z.object({
  NEXTAUTH_URL: z.string().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().default('development-secret-32-chars-long-change-for-production'),
  DATABASE_URL: z.string().default('file:./dev.db'),

  // OAuth providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),

  // For development
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type AuthEnv = z.infer<typeof authEnvSchema>

export function validateAuthEnv(): AuthEnv {
  try {
    return authEnvSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables for auth:', error)
    throw new Error('Invalid environment variables')
  }
}
