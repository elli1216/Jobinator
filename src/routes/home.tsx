import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  LayoutGrid,
  ClipboardList,
} from 'lucide-react'
import CardSwap, { Card } from '@/components/CardSwap'

export const Route = createFileRoute('/home')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="bg-background text-foreground md:pb-20">
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
        <div className='hidden md:block'>
          <CardSwap
            cardDistance={60}
            verticalDistance={60}
            delay={3000}
            pauseOnHover={false}
            width={600}
          >
            <Card>
              <div className="p-8 h-full border rounded-lg bg-secondary flex flex-col items-center justify-center">
                <LayoutDashboard className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
                <p>
                  Get a high-level overview of your job search with key stats at a
                  glance.
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-8 h-full border rounded-lg bg-primary flex flex-col items-center justify-center">
                <LayoutGrid className="w-12 h-12 mb-4 text-secondary" />
                <h3 className="text-2xl text-white font-bold mb-2">
                  Kanban Board
                </h3>
                <p className='text-white'>
                  Visualize your pipeline and drag-and-drop applications between
                  stages.
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-8 h-full border rounded-lg bg-background flex flex-col items-center justify-center">
                <ClipboardList className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Smart Tracking</h3>
                <p>
                  Never forget to follow up. Keep notes, links, and important
                  dates in one place.
                </p>
              </div>
            </Card>
          </CardSwap>
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
