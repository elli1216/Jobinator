import { z } from 'zod'
import { ApplicationStatus, ApplicationMethod } from '@/generated/prisma/enums'

export const applicationSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_location: z.string().optional(),
  job_title: z.string().min(1, 'Job title is required'),
  date_applied: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z
    .enum(ApplicationStatus)
    .default(ApplicationStatus.To_Apply)
    .optional(),
  application_method: z.enum(ApplicationMethod),
  job_link: z.url().optional().or(z.literal('')),
  notes: z.string().optional(),
  jobTypeId: z.string().min(1, 'Job type is required'),
})

export type ApplicationSchema = z.infer<typeof applicationSchema>
