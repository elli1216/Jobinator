import { SidebarTrigger } from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { ModeToggle } from './mode-toggle'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/clerk-react'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function Header() {
  const { isSignedIn, user } = useAuth()

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
            {isSignedIn && (
              <div className="flex items-center gap-2 mr-5">
                <Tooltip>
                  <TooltipTrigger>
                    <Button><User /></Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className='flex flex-col gap-1'>
                      <p>{user?.fullName}</p>
                      <p>{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <SignOutButton>
                        <AlertDialogAction>
                          <span>Logout</span>
                          <LogOut className="h-4 w-4" />
                        </AlertDialogAction>
                      </SignOutButton>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
