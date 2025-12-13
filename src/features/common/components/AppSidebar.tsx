import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Home, PlusCircleIcon, List } from 'lucide-react'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Add New Job',
    url: '/add-job',
    icon: PlusCircleIcon,
  },
  {
    title: 'Your List',
    url: '/your-list',
    icon: List,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarMenu className="pt-4 px-2 gap-4" aria-label="Main Menu">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="p-2"
                asChild
                variant="outline"
                size="default"
              >
                <a href={item.url}>
                  <item.icon className="ml-1 h-8 w-8" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
