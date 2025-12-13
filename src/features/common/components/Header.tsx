import { SidebarTrigger } from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'

export default function Header() {
  return (
    <>
      <header className="p-4 flex items-center bg-accent text-content shadow-lg">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">
              <Link to="/">Job App Tracker</Link>
            </h1>
          </div>
          <ModeToggle />
        </div>
      </header>
    </>
  )
}
