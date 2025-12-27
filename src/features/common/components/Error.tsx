import { Button } from '@/components/ui/button'

export default function ErrorComponent({ error }: { error: Error }) {
  const reload = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <p className="text-lg font-semibold">An unexpected error occurred:</p>
      <pre className="whitespace-pre-wrap text-sm text-red-600">
        {error.message}
      </pre>
      <Button onClick={reload} className="ml-4" asChild>
        <span>Reload</span>
      </Button>
    </div>
  )
}
