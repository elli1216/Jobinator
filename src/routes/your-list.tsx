import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from '../features/common/components/HomeLayout'

export const Route = createFileRoute('/your-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <HomeLayout>
      <div className="p-4">Hello "/your-list"!</div>
    </HomeLayout>
  )
}
