import { Home, List, PlusCircleIcon, LayoutGrid } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const items = [
  {
    title: 'Home',
    to: '/user/home',
    icon: Home,
  },
  {
    title: 'Add New Job',
    to: '/user/add-job',
    icon: PlusCircleIcon,
  },
  {
    title: 'Your List',
    to: '/user/your-list',
    icon: List,
  },
  {
    title: 'Board',
    to: '/user/board',
    icon: LayoutGrid,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()

  const redirectTo = (to: string) => {
    navigate({
      to,
    })
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarMenu className="pt-4 px-2 gap-4" aria-label="Main Menu">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="p-2"
                variant="outline"
                size="default"
                onClick={() => redirectTo(item.to)}
              >
                <item.icon className="ml-1 h-8 w-8" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
