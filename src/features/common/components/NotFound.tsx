import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <p className="text-lg font-semibold">404: Page Not Found</p>
      <Button className="ml-4" asChild>
        <a href="/">Go Home</a>
      </Button>
    </div>
  )
}
