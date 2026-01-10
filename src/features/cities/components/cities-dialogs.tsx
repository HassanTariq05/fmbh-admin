import { useDeleteCity } from '@/hooks/use-cities'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CitiesMutateDrawer } from './cities-mutate-drawer'
import { useCities } from './cities-provider'

export function CitiesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCities()

  const deleteLodge = useDeleteCity()

  const handleDeleteLodge = (id: number) => {
    deleteLodge.mutate(id.toString())
    console.log(id)
  }

  return (
    <>
      <CitiesMutateDrawer
        key='create-city'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <CitiesMutateDrawer
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
            key='city-delete'
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
            title={`Delete this Lodge: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a city{' '}
                <strong>{currentRow.name}</strong>. <br />
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
