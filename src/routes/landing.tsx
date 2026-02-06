import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Loading } from '@/features/common/components/Loading'
import { useUser } from '@clerk/clerk-react'
import { ArrowRight, Sparkles } from 'lucide-react'
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
    <div className="bg-background text-foreground overflow-hidden">
      <Header />
      <section className="relative flex min-h-[calc(100vh-140px)] items-center justify-center px-6 py-20">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-150 w-150 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute bottom-1/4 right-1/4 h-150 w-150 animate-pulse rounded-full bg-primary/5 blur-3xl"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="mx-auto max-w-7xl space-y-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground/70 backdrop-blur-xl transition-all duration-300 hover:border-border">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Your ultimate job search companion</span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
            <span className="block">Stop Drowning in</span>
            <span className="mt-2 block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Job Applications
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Jobinator helps you track every application, manage interviews, and
            stay organized, so you can focus on landing your dream job.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
            <Link to="/login">
              <Button size="lg" className="group h-12 rounded-full px-8 text-base">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-8 text-base hover:bg-foreground/5"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-center items-center ">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Jobinator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}