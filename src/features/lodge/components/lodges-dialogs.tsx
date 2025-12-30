import { useDeleteLodge } from '@/hooks/use-lodges'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { LodgesMutateDrawer } from './lodges-mutate-drawer'
import { useLodges } from './lodges-provider'

export function LodgesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLodges()

  const deleteLodge = useDeleteLodge()

  const handleDeleteLodge = (id: number) => {
    deleteLodge.mutate(id.toString())
    console.log(id)
  }

  return (
    <>
      <LodgesMutateDrawer
        key='create-lodge'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <LodgesMutateDrawer
            key={`update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='lodge-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              handleDeleteLodge(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Lodge: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a lodge{' '}
                <strong>{currentRow.title}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
