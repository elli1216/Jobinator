import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../hooks/use-auth'

export const Route = createFileRoute('/protected')({
  component: ProtectedComponent,
})

function ProtectedComponent() {
  const { isSignedIn, user } = useAuth()

  if (!isSignedIn) {
    // The hook will redirect, but we can show a loading state here.
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      <h1>Welcome, {user?.firstName}</h1>
      <p>This is a protected route.</p>
    </div>
  )
}
