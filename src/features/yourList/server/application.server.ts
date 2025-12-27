import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/db'
import { z } from 'zod'

export const getApplicationList = createServerFn({
  method: 'GET',
})
  .inputValidator((clerkId: string) => z.string().parse(clerkId))
  .handler(async ({ data: clerkId }) => {
    const user = await prisma.users.findUnique({
      where: { clerkId },
    })

    if (!user) return []

    const jobs = await prisma.applications.findMany({
      where: { userId: user.uuid },
      orderBy: { date_applied: 'desc' },
    })
    return jobs
  })

export type Application = Awaited<ReturnType<typeof getApplicationList>>[number]
