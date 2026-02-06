import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import UserHeader from '@/features/dashboard/components/UserHeader'
import { AppSidebar } from '@/features/common/components/AppSidebar'

export const Route = createFileRoute('/user')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <UserHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
