import { z } from 'zod'

export const serverEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  })
  .parse(process.env)

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3000'),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>
