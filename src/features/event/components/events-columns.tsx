import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const eventColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Event Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-72 font-medium'>
        {row.getValue('title')}
      </LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-96 text-gray-700'>
        {row.getValue('description')}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'start_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ row }) =>
      row.getValue('start_at')
        ? format(new Date(row.getValue('start_at')), 'MMM dd, yyyy, hh:mm a')
        : '—',
    enableSorting: true,
  },
  {
    accessorKey: 'end_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ row }) =>
      row.getValue('end_at')
        ? format(new Date(row.getValue('end_at')), 'MMM dd, yyyy, hh:mm a')
        : '—',
    enableSorting: true,
  },
  {
    accessorKey: 'lodge_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lodge Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-56'>{row.getValue('lodge_name')}</LongText>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'lodge_city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => row.getValue('lodge_city'),
    enableSorting: true,
  },
  {
    accessorKey: 'lodge_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Country' />
    ),
    cell: ({ row }) => row.getValue('lodge_country'),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status: any = row.getValue('status')
      const colorMap: Record<string, string> = {
        draft: 'bg-gray-200 text-gray-800',
        published: 'bg-green-200 text-green-800',
        cancelled: 'bg-red-200 text-red-800',
        completed: 'bg-blue-200 text-blue-800',
      }
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            colorMap[status] || 'bg-gray-200 text-gray-800'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
