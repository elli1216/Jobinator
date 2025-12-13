import { z } from 'zod'

export const applicationSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  date_applied: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.enum([
    'To_Apply',
    'Applied',
    'Interviewing',
    'Offered',
    'Rejected',
    'Accepted',
    'No_Response',
  ]),
  job_link: z.url().optional().or(z.literal('')),
  notes: z.string().optional(),
  jobTypeId: z.string().min(1, 'Job type is required'),
})

export type ApplicationSchema = z.infer<typeof applicationSchema>

export const applicationStatuses = [
  'To_Apply',
  'Applied',
  'Interviewing',
  'Offered',
  'Rejected',
  'Accepted',
  'No_Response',
] as const

export const jobTypes = [
  { id: '1', name: 'Full-time' },
  { id: '2', name: 'Part-time' },
  { id: '3', name: 'Contract' },
  { id: '4', name: 'Internship' },
]
