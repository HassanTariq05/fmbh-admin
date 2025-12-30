import { DotsHorizontalIcon } from '@radix-ui/react-icons'
// import { useNavigate } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { lodgeSchema } from '../data/schema'
import { useLodges } from './lodges-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const lodge = lodgeSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useLodges()

  // const navigate = useNavigate()

  // const handleViewLodge = (id: number) => {
  //   navigate({ to: `/lodge/${id}` })
  // }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {/* <DropdownMenuItem
          onClick={() => {
            handleViewLodge(lodge?.id)
          }}
        >
          View
          <DropdownMenuShortcut>
            <Eye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem> */}

        <>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(lodge)
              setOpen('update')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <Pencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(lodge)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
