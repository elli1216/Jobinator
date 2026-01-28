import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { prisma } from '@/db'
import { Prisma } from '@/generated/prisma/client'
import { ApplicationStatus, ApplicationMethod } from '@/generated/prisma/enums'

export const getApplicationList = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (data: {
      clerkId: string
      search?: string
      status?: z.infer<typeof ApplicationStatus>[]
    }) =>
      z
        .object({
          clerkId: z.string(),
          search: z.string().optional(),
          status: z.array(z.nativeEnum(ApplicationStatus)).optional(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const user = await prisma.users.findUnique({
      where: { clerkId: data.clerkId },
    })

    if (!user) return []

    const where: Prisma.ApplicationsWhereInput = { userId: user.uuid }

    if (data.search) {
      where.OR = [
        {
          company_name: {
            contains: data.search,
            mode: 'insensitive',
          },
        },
        {
          job_title: {
            contains: data.search,
            mode: 'insensitive',
          },
        },
      ]
    }

    if (data.status && data.status.length > 0) {
      where.status = {
        in: data.status,
      }
    }

    const jobs = await prisma.applications.findMany({
      where,
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
      status: z.infer<typeof ApplicationStatus>
    }) =>
      z
        .object({
          applicationId: z.string(),
          status: z.enum(ApplicationStatus),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    await prisma.applications.update({
      where: { uuid: data.applicationId },
      data: { status: data.status, updatedAt: new Date() },
    })
  })

export const updateApplicationMethod = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      applicationId: string
      application_method: z.infer<typeof ApplicationMethod>
    }) =>
      z
        .object({
          applicationId: z.string(),
          application_method: z.enum(ApplicationMethod),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    await prisma.applications.update({
      where: { uuid: data.applicationId },
      data: {
        application_method: data.application_method,
        updatedAt: new Date(),
      },
    })
  })

export type Application = Awaited<ReturnType<typeof getApplicationList>>[number]

export const getDashboardStats = createServerFn({
  method: 'GET',
})
  .inputValidator((clerkId: string) => z.string().parse(clerkId))
  .handler(async ({ data: clerkId }) => {
    const user = await prisma.users.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return {
        stats: {
          totalApplied: 0,
          interviewing: 0,
          offers: 0,
          ghosted: 0,
        },
        recentActivity: [],
      }
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const statusCounts = await prisma.applications.groupBy({
      by: ['status'],
      where: { userId: user.uuid },
      _count: {
        status: true,
      },
    })

    const totalApplied = await prisma.applications.count({
      where: { userId: user.uuid },
    })

    const ghosted = await prisma.applications.count({
      where: {
        userId: user.uuid,
        status: {
          in: ['Applied', 'Interviewing'],
        },
        OR: [
          {
            updatedAt: {
              lt: thirtyDaysAgo,
            },
          },
          {
            updatedAt: null,
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        ],
      },
    })

    const interviewing =
      statusCounts.find((s) => s.status === 'Interviewing')?._count.status || 0
    const offers =
      statusCounts.find((s) => s.status === 'Offered')?._count.status || 0

    const recentActivity = await prisma.applications.findMany({
      where: { userId: user.uuid },
      orderBy: { updatedAt: { sort: 'desc', nulls: 'last' } },
      take: 5,
      include: { jobType: true },
    })

    return {
      stats: {
        totalApplied,
        interviewing,
        offers,
        ghosted,
      },
      recentActivity,
    }
  })

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>
export type RecentActivity = DashboardStats['recentActivity']
