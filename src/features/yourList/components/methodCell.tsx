import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateApplicationMethod } from '../server/application.server'
import { toast } from 'sonner'
import { ApplicationMethod } from '@/generated/prisma/enums'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function MethodCell({
  method,
  applicationId,
}: {
  method: ApplicationMethod
  applicationId: string
}) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: updateApplicationMethod,
    onSuccess: async () =>
      toast.promise(
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        {
          loading: 'Updating method...',
          success: 'method updated successfully',
          error: 'Failed to update method',
        },
      ),
    onError: () => {
      console.error('Failed to update method')
    },
  })

  const handleValueChange = (newMethod: ApplicationMethod) => {
    mutate({ data: { applicationId, application_method: newMethod } })
  }

  return (
    <Select
      value={method}
      onValueChange={handleValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={method} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Change Method</SelectLabel>
          {Object.values(ApplicationMethod).map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
