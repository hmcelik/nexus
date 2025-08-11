export * from '@prisma/client'
export { PrismaClient } from '@prisma/client'

// Export the prisma instance
import { PrismaClient } from '@prisma/client'

// Create a singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Re-export common types for convenience
export type { User, Account, Session, Bot, Plugin, Platform, BotStatus } from '@prisma/client'
