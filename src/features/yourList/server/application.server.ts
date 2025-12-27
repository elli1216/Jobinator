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
      include: { jobType: true },
      orderBy: { date_applied: 'desc' },
    })
    return jobs
  })

export const updateApplicationStatus = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      applicationId: string
      status:
        | 'To_Apply'
        | 'Applied'
        | 'Interviewing'
        | 'Offered'
        | 'Rejected'
        | 'Accepted'
        | 'No_Response'
    }) =>
      z
        .object({
          applicationId: z.string(),
          status: z.enum([
            'To_Apply',
            'Applied',
            'Interviewing',
            'Offered',
            'Rejected',
            'Accepted',
            'No_Response',
          ]),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    await prisma.applications.update({
      where: { uuid: data.applicationId },
      data: { status: data.status },
    })
  })

export type Application = Awaited<ReturnType<typeof getApplicationList>>[number]
