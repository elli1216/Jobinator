import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Home, PlusCircleIcon, List, Lock, LogIn } from 'lucide-react'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Add New Job',
    url: '#',
    icon: PlusCircleIcon,
  },
  {
    title: 'Job List',
    url: '#',
    icon: List,
  },
  {
    title: 'Login',
    url: '/login',
    icon: LogIn,
  },
  {
    title: 'Protected',
    url: '/protected',
    icon: Lock,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarMenu className="pt-10" aria-label="Main Menu">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="ml-1 h-5 w-5" />
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
