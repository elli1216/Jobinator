import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from '../features/common/components/HomeLayout'
import { useAuth } from '../hooks/use-auth'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { user } = useAuth()

  return (
    <HomeLayout>
      <div className="flex flex-col h-full justify-center items-center p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome {user?.firstName}</h1>
        <p className="text-lg">
          Track your job applications efficiently and stay organized throughout
          your job search journey.
        </p>
      </div>
    </HomeLayout>
  )
}
