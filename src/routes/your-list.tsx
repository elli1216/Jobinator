import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/db'
import { Loading } from '@/features/common/components/Loading'
import ApplicationTable from '../features/yourList/components/applicationTable';

const getApplicationList = createServerFn({
  method: 'GET',
}).handler(async () => {
  const jobs = (await prisma.applications.findMany({
    orderBy: { createdAt: 'desc' },
  }));
  return jobs
})

export type Application = Awaited<ReturnType<typeof getApplicationList>>[number]

export const Route = createFileRoute('/your-list')({
  component: RouteComponent,
  loader: async () => {
    const applicationList = await getApplicationList()
    return { applicationList }
  },
  pendingComponent: () => <Loading />,
})

function RouteComponent() {
  const { applicationList } = Route.useLoaderData()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
      <ApplicationTable applicationList={applicationList} />
    </div>
  )
}