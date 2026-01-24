import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Github,
  Linkedin,
  Twitter,
  LayoutDashboard,
  LayoutGrid,
  ClipboardList,
} from 'lucide-react'

export const Route = createFileRoute('/home')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">
          Stop Drowning in Job Applications.
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Jobinator helps you track every application, manage interviews, and
          stay organized, so you can focus on landing your dream job.
        </p>
        <Link to="/login">
          <Button size="lg">Get Started for Free</Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border rounded-lg bg-background flex flex-col items-center">
              <LayoutDashboard className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
              <p>
                Get a high-level overview of your job search with key stats at a
                glance.
              </p>
            </div>
            <div className="p-8 border rounded-lg bg-background flex flex-col items-center">
              <LayoutGrid className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Kanban Board</h3>
              <p>
                Visualize your pipeline and drag-and-drop applications between
                stages.
              </p>
            </div>
            <div className="p-8 border rounded-lg bg-background flex flex-col items-center">
              <ClipboardList className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Smart Tracking</h3>
              <p>
                Never forget to follow up. Keep notes, links, and important
                dates in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <p>&copy; 2026 Jobinator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
