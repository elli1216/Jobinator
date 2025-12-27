import { SidebarTrigger } from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/clerk-react'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Header() {
  const { isSignedIn } = useAuth()

  return (
    <>
      <header className="p-4 flex items-center bg-accent text-content shadow-lg">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {isSignedIn && <SidebarTrigger />}
            <h1 className="text-xl font-semibold">
              <img
                src="/jobinator.png"
                alt="Jobinator Logo"
                className="inline-block h-8 w-8 mr-2"
              />
              <Link to="/">Jobinator</Link>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {isSignedIn && (<SignOutButton>
              <Button variant="outline">
                <LogOut className="h-4 w-4" />
              </Button>
            </SignOutButton>)}
          </div>
        </div>
      </header>
    </>
  )
}