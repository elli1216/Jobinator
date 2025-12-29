import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { applicationSchema } from '../schema/addJob.schema'
import { prisma } from '@/db'
import { ApplicationStatus } from '@/generated/prisma/enums'

export const getJobTypes = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await prisma.jobTypes.findMany()
})

export const addJob = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    applicationSchema.extend({ clerkId: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    const user = await prisma.users.findUnique({
      where: { clerkId: data.clerkId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return await prisma.applications.create({
      data: {
        company_name: data.company_name,
        job_title: data.job_title,
        date_applied: new Date(data.date_applied),
        status: data.status,
        job_link: data.job_link || '',
        notes: data.notes || '',
        jobTypeId: data.jobTypeId,
        userId: user.uuid,
      },
    })
  })

export const changeJobStatus = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        applicationId: z.string(),
        status: z.enum(ApplicationStatus),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return await prisma.applications.update({
      where: { uuid: data.applicationId },
      data: { status: data.status },
    })
  })
