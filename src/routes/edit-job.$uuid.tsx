import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  applicationSchema,
  type ApplicationSchema,
} from '../features/addJob/schema/addJob.schema'
import { getJobById } from '@/features/editJob/server/editJob.server'
import { useAuth } from '@/hooks/use-auth'
import { Loading } from '@/features/common/components/Loading'
import Error from '@/features/common/components/Error'
import { ApplicationStatus, ApplicationMethod } from '@/generated/prisma/enums'
import { getJobTypes } from '@/features/addJob/server/addJob.server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Applications, JobTypes } from '@/generated/prisma/client'
import { editJob } from '@/features/editJob/server/editJob.server'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@tanstack/react-router'

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
  const { jobTypes } = Route.useLoaderData()

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', uuid],
    queryFn: async () =>
      getJobById({ data: { applicationId: uuid, clerkId: user?.id! } }),
  })

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />
  if (!data) return <Error error="Job not found" />

  return <JobForm data={data} jobTypes={jobTypes} user={{ id: user?.id! }} />
}

function JobForm({
  data,
  jobTypes,
  user,
}: {
  data: Applications
  jobTypes: JobTypes[]
  user: { id: string }
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    control,
  } = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: data.company_name,
      company_location: data.company_location,
      job_title: data.job_title,
      application_method: data.application_method,
      date_applied: data.date_applied
        ? new Date(data.date_applied).toISOString().split('T')[0]
        : '',
      status: data.status,
      job_link: data.job_link || '',
      notes: data.notes || '',
      jobTypeId: data.jobTypeId,
    },
  })

  const { mutate: editMutation, isPending } = useMutation({
    mutationFn: editJob,
    onSuccess: async () =>
      toast.promise(
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        {
          loading: 'Updating job application...',
          success: 'Job application updated successfully',
          error: 'Failed to update job application',
        },
      ),
    onError: (error) => {
      console.error('Failed to update job application', error)
    },
  })

  const onSubmit = (formData: ApplicationSchema) => {
    editMutation({
      data: {
        applicationData: {
          ...data,
          ...formData,
          date_applied: new Date(formData.date_applied!),
        },
        clerkId: user.id,
      },
    })
    router.invalidate({ sync: true })
    navigate({ to: '/your-list' })
  }

  return (
    <div className="flex justify-center w-full pt-4">
      <div className="p-4 w-full md:w-2/3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium"
              >
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
              <label
                htmlFor="company_name"
                className="block text-sm font-medium"
              >
                Location
              </label>
              <Input
                id="company_location"
                {...register('company_location')}
                className="mt-1"
              />
              {errors.company_name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.company_location?.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label htmlFor="job_title" className="block text-sm font-medium">
                Job Title
              </label>
              <Input
                id="job_title"
                {...register('job_title')}
                className="mt-1"
              />
              {errors.job_title && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.job_title.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="job_title" className="block text-sm font-medium">
                Application Method
              </label>
              <Controller
                control={control}
                name="application_method"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ApplicationMethod).map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
            <Textarea
              id="notes"
              rows={5}
              {...register('notes')}
              className="mt-1 block w-full shadow-sm sm:text-sm rounded-md"
            />
            {errors.notes && (
              <p className="text-sm text-red-600 mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.history.back()}
              disabled={isPending}
              type="button"
            >
              Back
            </Button>
            <Button type="submit" disabled={isPending || !isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
