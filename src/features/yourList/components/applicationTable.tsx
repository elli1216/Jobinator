import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { fuzzyFilter } from '@/features/common/utils/table.utils'
import { Application } from '@/features/yourList/server/application.server'
import { FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router';

const columnHelper = createColumnHelper<Application>()

const columns = [
  columnHelper.accessor('company_name', {
    header: 'Company Name',
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
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('job_link', {
    header: 'Job Link',
    cell: (info) => {
      const url = info.getValue()
      return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
      ) : "Not provided"
    }
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => <span>{info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : 'N/A'}</span>,
  }),
]

export default function ApplicationTable({ applicationList }: { applicationList: Application[] }) {
  const navigate = useNavigate();
  const table = useReactTable<Application>({
    data: applicationList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: { fuzzy: fuzzyFilter },
  })

  const redirectToAddApplication = () => {
    navigate({
      to: '/add-job'
    });
  }

  return (
    <div className="rounded-md w-full border overflow-x-auto">
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
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-full p-10 text-center">
                <FileX className="mx-auto p-4 size-20 text-muted-foreground" />
                <div className='flex flex-col justify-center items-center'>
                  <span className='text-2xl font-bold text-muted-foreground'>No records yet.</span>
                  <Button onClick={redirectToAddApplication} className="mt-4 max-w-xs hover:cursor-pointer" variant="secondary">Add your first application</Button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
} 