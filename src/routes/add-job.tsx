import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from '../features/common/components/HomeLayout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  applicationSchema,
  ApplicationSchema,
  applicationStatuses,
  jobTypes,
} from '../features/addJob/schema/addJob.schema'

export const Route = createFileRoute('/add-job')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'To_Apply',
      job_link: '',
      notes: '',
      company_name: '',
      job_title: '',
      date_applied: '',
      jobTypeId: '',
    },
  })

  const onSubmit = (data: ApplicationSchema) => {
    // API call will be added here later
    console.log('Form data is valid:', data)
  }

  return (
    <HomeLayout>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Job Application</h1>
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

          <div>
            <label htmlFor="date_applied" className="block text-sm font-medium">
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
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">
                {errors.status.message}
              </p>
            )}
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
            <select
              id="jobTypeId"
              {...register('jobTypeId')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a job type</option>
              {jobTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
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

          <div>
            <Button type="submit">Add Application</Button>
          </div>
        </form>
      </div>
    </HomeLayout>
  )
}
