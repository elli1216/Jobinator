import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { fuzzyFilter } from '@/features/common/utils/table.utils'
import { Application } from '@/routes/your-list'

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
  columnHelper.accessor('date_applied', {
    header: 'Date Applied',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
]

export default function ApplicationTable({ applicationList }: { applicationList: Application[] }) {
  const table = useReactTable<Application>({
    data: applicationList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: { fuzzy: fuzzyFilter },
  })
  return (
    <div className="rounded-md border">
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
              <td colSpan={columns.length} className="h-24 text-center">
                No records.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
} 