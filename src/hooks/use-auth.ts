import { useUser } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/demo/login', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  return { isLoaded, isSignedIn, user }
}
