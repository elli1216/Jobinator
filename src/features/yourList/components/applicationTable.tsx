import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { FilePen, FileX, Trash2, ListFilter } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import AlertDialogDelete from './alertDialog'
import type { Application } from '@/features/yourList/server/application.server'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { deleteJob } from '@/features/editJob/server/editJob.server'
import { useAuth } from '@/hooks/use-auth'
import StatusCell from './statusCell'
import MethodCell from './methodCell'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDebounce } from '@/hooks/use-debounce'
import { ApplicationStatus } from '@/generated/prisma/enums'
import { YourListSearchSchema } from '@/routes/your-list'
import { Loading } from '@/features/common/components/Loading'

const columnHelper = createColumnHelper<Application>()

export default function ApplicationTable({
  applicationList,
  search,
  status,
  isLoading,
}: {
  applicationList: Array<Application>
  search?: string
  status?: Array<ApplicationStatus>
  isLoading?: boolean
}) {
  const { user } = useAuth()
  const navigate = useNavigate({ from: '/your-list' })
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState(search ?? '')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    navigate({
      search: (prev: YourListSearchSchema) => ({
        ...prev,
        search: debouncedSearch,
      }),
      replace: true,
    })
  }, [debouncedSearch, navigate])

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: deleteJob,
    onSuccess: async () =>
      toast.promise(
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        {
          loading: 'Deleting application...',
          success: 'Application deleted successfully',
          error: 'Failed to delete application',
        },
      ),
    onError: (error) => {
      console.error('Failed to delete application', error)
    },
  })

  const onDelete = async (
    applicationId: string,
    clerkId: string | undefined,
  ) => {
    if (!clerkId) {
      toast.error('User not authenticated')
      return
    }

    deleteMutation({ data: { applicationId, clerkId } })
  }

  const columns = [
    columnHelper.accessor('company_name', {
      header: 'Company Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('company_location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('job_title', {
      header: 'Job Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('jobType.name', {
      header: 'Job Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('date_applied', {
      header: 'Date Applied',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('application_method', {
      header: 'Application Method',
      cell: (info) => (
        <MethodCell
          method={info.getValue()}
          applicationId={info.row.original.uuid}
        />
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <StatusCell
          status={info.getValue()}
          applicationId={info.row.original.uuid}
        />
      ),
    }),
    columnHelper.accessor('job_link', {
      header: 'Job Link',
      cell: (info) => {
        const url = info.getValue()
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View
          </a>
        ) : (
          'Not provided'
        )
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: (info) => (
        <span>
          {info.getValue()
            ? new Date(info.getValue()!).toLocaleDateString()
            : 'N/A'}
        </span>
      ),
    }),
    columnHelper.accessor('uuid', {
      header: '',
      cell: (info) => (
        <div className="flex gap-1">
          <Button
            variant={'default'}
            disabled={isPending}
            onClick={() => navigate({ to: `/edit-job/${info.getValue()}` })}
          >
            <FilePen />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={'destructive'} disabled={isPending}>
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogDelete
              onClick={() => onDelete(info.getValue(), user?.id)}
            />
          </AlertDialog>
        </div>
      ),
    }),
  ]

  const table = useReactTable<Application>({
    data: applicationList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const redirectToAddApplication = () => {
    navigate({
      to: '/add-job',
    })
  }

  const handleStatusChange = (statusValue: ApplicationStatus) => {
    const currentStatus = status || []
    const newStatus = currentStatus.includes(statusValue)
      ? currentStatus.filter((s) => s !== statusValue)
      : [...currentStatus, statusValue]

    navigate({
      search: (prev: YourListSearchSchema) => ({ ...prev, status: newStatus }),
      replace: true,
    })
  }

  return (
    <div className="rounded-md w-full border overflow-x-auto">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Search by Company or Job Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              <ListFilter className="h-4 w-4 mr-2" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(ApplicationStatus).map((statusValue) => (
              <DropdownMenuCheckboxItem
                key={statusValue}
                checked={status?.includes(statusValue)}
                onCheckedChange={() => handleStatusChange(statusValue)}
              >
                {statusValue}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="h-12 px-4 align-middle font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="h-64">
                <Loading />
              </td>
            </tr>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-full p-10 text-center">
                <FileX className="mx-auto p-4 size-20 text-muted-foreground" />
                <div className="flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold text-muted-foreground">
                    No records found.
                  </span>
                  <Button
                    onClick={redirectToAddApplication}
                    className="mt-4 max-w-xs hover:cursor-pointer"
                    variant="secondary"
                  >
                    Add your first application
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
