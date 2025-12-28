import { createServerFn } from '@tanstack/react-start'
import { userSchema } from '../schema/user.schema'
import { prisma } from '@/db'

export const syncUser = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => userSchema.parse(data))
  .handler(async ({ data }) => {
    const { clerkId, email, fullName } = data

    const user = await prisma.users.upsert({
      where: { clerkId },
      update: {
        email,
        full_name: fullName,
      },
      create: {
        clerkId,
        email,
        full_name: fullName,
      },
    })

    return user
  })
