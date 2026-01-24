import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateApplicationStatus } from '../server/application.server'
import { toast } from 'sonner'
import { ApplicationStatus } from '@/generated/prisma/enums'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StatusCell({
  status,
  applicationId,
}: {
  status: ApplicationStatus
  applicationId: string
}) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: async () =>
      toast.promise(
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        {
          loading: 'Updating status...',
          success: 'Status updated successfully',
          error: 'Failed to update status',
        },
      ),
    onError: () => {
      console.error('Failed to update status')
    },
  })

  const handleValueChange = (newStatus: ApplicationStatus) => {
    mutate({ data: { applicationId, status: newStatus } })
  }

  return (
    <Select
      value={status}
      onValueChange={handleValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={status} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Change Status</SelectLabel>
          {Object.values(ApplicationStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
