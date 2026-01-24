import { Loading } from '@/features/common/components/Loading'
import { SignIn } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  pendingComponent: () => <Loading />,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-full m-auto p-4">
      <SignIn />
    </div>
  )
}
