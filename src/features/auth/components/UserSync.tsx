import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { syncUser } from '../server/syncUser'

export function UserSync() {
  const { user, isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    const sync = async () => {
      if (user) {
        const primaryEmail = user.primaryEmailAddress?.emailAddress
        if (!primaryEmail) return

        try {
          await syncUser({
            data: {
              clerkId: user.id,
              email: primaryEmail,
              fullName: user.fullName || 'Unnamed User',
            },
          })
        } catch (error) {
          console.error('Failed to sync user:', error)
        }
      }
    }

    sync()
  }, [isLoaded, isSignedIn, user])

  return null
}
