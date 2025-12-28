import { createServerFn } from '@tanstack/react-start'
import type { ApplicationSchema } from '@/features/addJob/schema/addJob.schema'
import { prisma } from '@/db'

export const getJobById = createServerFn({ method: 'GET' })
  .inputValidator((data: { applicationId: string; clerkId: string }) => data)
  .handler(async ({ data }) => {
    const user = await prisma.users.findUnique({
      where: { clerkId: data.clerkId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return await prisma.applications.findFirst({
      where: { uuid: data.applicationId, userId: user.uuid },
    })
  })

export const editJob = createServerFn({ method: 'POST' })
  .inputValidator((data: ApplicationSchema) => data)
  .handler(async ({ data }) => {
    // Implement the logic to edit a job application in the database
    console.log('Editing job application:', data)
    return { success: true }
  })
