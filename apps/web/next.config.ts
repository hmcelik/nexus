import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'file:D:/nexus/packages/database/prisma/dev.db',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  /* config options here */
}

export default nextConfig
