import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Loading } from '@/features/common/components/Loading'
import { useUser } from '@clerk/clerk-react'
import Header from '@/features/common/components/Header'

export const Route = createFileRoute('/landing')({
  component: LandingPage,
})

function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { isLoaded, isSignedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate({ to: '/user/home', replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  if (!mounted || !isLoaded) return <Loading />

  if (isSignedIn) return null

  return (
    <div className="bg-background text-foreground md:pb-20">
      <Header />
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:relative h-130 text-center px-4">
        <div className="flex flex-col items-center justify-center px-20 pt-25 md:pt-12">
          <h1 className="text-5xl w-md font-bold mb-4">
            Stop Drowning in Job Applications.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Jobinator helps you track every application, manage interviews, and
            stay organized, so you can focus on landing your dream job.
          </p>
          <Link to="/login">
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 fixed bottom-0 w-full bg-secondary border-t">
        <div className="container mx-auto px-4 flex justify-center items-center ">
          <p>&copy; 2026 Jobinator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
