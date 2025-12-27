import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../hooks/use-auth'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col h-full justify-center items-center p-4">
      <img
        src="/jobinator.png"
        alt="Jobinator Logo"
        className="inline-block h-30 w-40 mb-4"
      />
      <h1 className="text-4xl font-bold mb-4">Welcome {user?.firstName}</h1>
      <p className="text-lg">
        Track and manage your job applications efficiently and stay organized
        throughout your job search journey.
      </p>
    </div>
  )
}
