import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import ApplicationTable from '../features/yourList/components/applicationTable'
import { getApplicationList } from '../features/yourList/server/application.server'
import { Loading } from '@/features/common/components/Loading'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/your-list')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoaded } = useAuth()
  const navigate = useNavigate()

  const { data: applicationList, isLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => getApplicationList({ data: user!.id }),
    enabled: !!user?.id,
  })
  console.log(applicationList);

  if (!isLoaded || isLoading) return <Loading />

  const handleAddNew = () => {
    navigate({ to: '/add-job' })
  }

  return (
    <div className="p-4">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
        <Button onClick={handleAddNew} variant="default">
          <Plus className="h-4 w-4" />
          <span>New</span>
        </Button>
      </div>
      <ApplicationTable applicationList={applicationList || []} />
    </div>
  )
}
