import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import ApplicationTable from '../features/yourList/components/applicationTable'
import { getApplicationList } from '../features/yourList/server/application.server'
import { Loading } from '@/features/common/components/Loading'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/your-list')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoaded } = useAuth()

  const { data: applicationList, isLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => getApplicationList({ data: user!.id }),
    enabled: !!user?.id,
  })

  if (!isLoaded || isLoading) return <Loading />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
      <ApplicationTable applicationList={applicationList || []} />
    </div>
  )
}
