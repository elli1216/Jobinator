import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/use-auth'
import { getDashboardStats } from '@/features/yourList/server/application.server'
import { Briefcase, CheckCircle, Clock, FileText } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Loading } from '@/features/common/components/Loading'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { RecentActivityList } from '@/features/dashboard/components/RecentActivityList'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isLoaded, isSignedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/home', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!isLoaded || !isSignedIn) {
    return <Loading />
  }

  return <Dashboard />
}

function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Loading />

  const { data } = useSuspenseQuery({
    queryKey: ['dashboardStats', user.id],
    queryFn: () => getDashboardStats({ data: user.id }),
  })

  const { stats, recentActivity } = data

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome {user.fullName || user.firstName || 'User'}
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Applied"
          value={stats.totalApplied}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Interviewing"
          value={stats.interviewing}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Offers"
          value={stats.offers}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Ghosted"
          value={stats.ghosted}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <RecentActivityList activity={recentActivity} />
    </div>
  )
}
