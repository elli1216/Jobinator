import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Loading } from '@/features/common/components/Loading'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { isLoaded, isSignedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        navigate({ to: '/user/home', replace: true })
      } else {
        navigate({ to: '/landing', replace: true })
      }
    }
  }, [isLoaded, isSignedIn, navigate])

  return <Loading />
}
