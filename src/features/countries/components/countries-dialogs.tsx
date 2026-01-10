import { useDeleteCountry } from '@/hooks/use-countries'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CountriesMutateDrawer } from './countries-mutate-drawer'
import { useCountries } from './countries-provider'

export function CountriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCountries()

  const deleteLodge = useDeleteCountry()

  const handleDeleteLodge = (id: number) => {
    deleteLodge.mutate(id.toString())
    console.log(id)
  }

  return (
    <>
      <CountriesMutateDrawer
        key='create-country'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <CountriesMutateDrawer
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
            key='country-delete'
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
                You are about to delete a country{' '}
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
