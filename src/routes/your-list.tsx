import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { ApplicationStatus } from '@/generated/prisma/enums'
import ApplicationTable from '../features/yourList/components/applicationTable'
import { getApplicationList } from '../features/yourList/server/application.server'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Loading } from '@/features/common/components/Loading'

const yourListSearchSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.nativeEnum(ApplicationStatus)).optional(),
})

export type YourListSearchSchema = z.infer<typeof yourListSearchSchema>

export const Route = createFileRoute('/your-list')({
  component: RouteComponent,
  validateSearch: (search) => yourListSearchSchema.parse(search),
})

function RouteComponent() {
  const { user } = useAuth()
  const navigate = useNavigate({ from: Route.fullPath })
  const { search, status } = Route.useSearch()

  const { data: applicationList, isFetching } = useQuery({
    queryKey: ['applications', user?.id, search, status],
    queryFn: () =>
      getApplicationList({
        data: {
          clerkId: user!.id,
          search,
          status,
        },
      }),
    enabled: !!user?.id,
  })

  const handleAddNew = () => {
    navigate({ to: '/add-job' })
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
        <Button onClick={handleAddNew} variant="default">
          <Plus className="h-4 w-4" />
          <span>New</span>
        </Button>
      </div>
      <ApplicationTable
        applicationList={applicationList || []}
        search={search}
        status={status}
        isLoading={isFetching}
      />
    </div>
  )
}
