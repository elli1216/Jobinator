import { z } from 'zod'

export const userSchema = z.object({
  clerkId: z.string(),
  email: z.email(),
  fullName: z.string(),
})
