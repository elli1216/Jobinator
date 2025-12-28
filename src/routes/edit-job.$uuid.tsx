import { createFileRoute, useNavigate  } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  applicationSchema
} from '../features/addJob/schema/addJob.schema'
import type {
  ApplicationSchema
} from '../features/addJob/schema/addJob.schema';
import { getJobById } from '@/features/editJob/server/editJob.server'
import { useAuth } from '@/hooks/use-auth'
import { Loading } from '@/features/common/components/Loading'
import Error from '@/features/common/components/Error'
import { ApplicationStatus } from '@/generated/prisma/enums'
import { getJobTypes } from '@/features/addJob/server/addJob.server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/edit-job/$uuid')({
  component: RouteComponent,
  loader: async () => {
    const jobTypes = await getJobTypes()
    return { jobTypes }
  },
  pendingComponent: () => <Loading />,
})

function RouteComponent() {
  const { uuid } = Route.useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { jobTypes } = Route.useLoaderData()

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', uuid],
    queryFn: async () => getJobById({ data: { applicationId: uuid, clerkId: user?.id! } }),
  })

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />

  const { formState: { errors }, register, handleSubmit, control } = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: data?.company_name,
      job_title: data?.job_title,
      date_applied: data?.date_applied.toISOString().split('T')[0],
      status: data?.status,
      job_link: data?.job_link || '',
      notes: data?.notes,
      jobTypeId: data?.jobTypeId,
    },
  })

  const onSubmit = (data: ApplicationSchema) => {
    console.log('Form submitted with data:', data)
    toast.success('Job application updated successfully')
    navigate({ to: '/your-list' })
  }

  return (
    <div className="flex justify-center w-full pt-4">
      <div className="p-4 w-full md:w-2/3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium">
              Company Name
            </label>
            <Input
              id="company_name"
              {...register('company_name')}
              className="mt-1"
            />
            {errors.company_name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.company_name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="job_title" className="block text-sm font-medium">
              Job Title
            </label>
            <Input id="job_title" {...register('job_title')} className="mt-1" />
            {errors.job_title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.job_title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="date_applied"
                className="block text-sm font-medium"
              >
                Date Applied
              </label>
              <Input
                type="date"
                id="date_applied"
                {...register('date_applied')}
                className="mt-1"
              />
              {errors.date_applied && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.date_applied.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ApplicationStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="job_link" className="block text-sm font-medium">
              Job Link
            </label>
            <Input id="job_link" {...register('job_link')} className="mt-1" />
            {errors.job_link && (
              <p className="text-sm text-red-600 mt-1">
                {errors.job_link.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="jobTypeId" className="block text-sm font-medium">
              Job Type
            </label>
            <Controller
              control={control}
              name="jobTypeId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes?.map((type) => (
                      <SelectItem key={type.uuid} value={type.uuid}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.jobTypeId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.jobTypeId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              {...register('notes')}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            {errors.notes && (
              <p className="text-sm text-red-600 mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>
          <div className='flex gap-2'>
            <Button onClick={() => window.history.back()} type="button">Back</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
