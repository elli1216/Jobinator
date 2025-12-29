import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  applicationSchema
} from '../features/addJob/schema/addJob.schema'
import { useAuth } from '../hooks/use-auth'
import { addJob, getJobTypes } from '../features/addJob/server/addJob.server'
import type {
  ApplicationSchema
} from '../features/addJob/schema/addJob.schema';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApplicationStatus, ApplicationMethod } from '@/generated/prisma/enums'
import { Loading } from '@/features/common/components/Loading'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/add-job')({
  component: RouteComponent,
  loader: async () => {
    const jobTypes = await getJobTypes()
    return { jobTypes }
  },
  pendingComponent: () => <Loading />,
})

function RouteComponent() {
  const { jobTypes } = Route.useLoaderData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: ApplicationStatus.To_Apply,
      job_link: '',
      notes: '',
      application_method: ApplicationMethod.Walk_in,
      company_name: '',
      company_location: '',
      job_title: '',
      date_applied: '',
      jobTypeId: '',
    },
  })

  const { mutate: addMutation, isPending } = useMutation({
    mutationFn: addJob,
    onSuccess: async () => toast.promise(
      queryClient.invalidateQueries({ queryKey: ['applications'] }),
      {
        loading: 'Adding job application...',
        success: 'Job application added successfully',
        error: 'Failed to add job application',
      },
    ),
    onError: (error) => {
      console.error('Failed to add job:', error)
    },
  })

  const onSubmit = async (data: ApplicationSchema) => {
    if (!user?.id) return
    addMutation({
      data: {
        ...data,
        clerkId: user.id,
      },
    })
    await router.invalidate({ sync: true })
    navigate({ to: '/your-list' })
  }

  return (
    <div className="flex justify-center w-full pt-4">
      <div className="p-4 w-full md:w-2/3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
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
              <label htmlFor="company_name" className="block text-sm font-medium">
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
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

          <div>
            <Button disabled={isPending} type="submit">Add Application</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
