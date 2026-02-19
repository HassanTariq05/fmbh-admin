import { useDeleteEvent } from '@/hooks/use-events'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EventsMutateDrawer } from './events-mutate-drawer'
import { useEvents } from './events-provider'
import { UploadEventsDialog } from './upload-events-dialog'

export function EventsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useEvents()

  const deleteEvent = useDeleteEvent()

  const handleDeleteEvent = (id: number) => {
    deleteEvent.mutate(id.toString())
    console.log(id)
  }

  return (
    <>
      <EventsMutateDrawer
        key='create-event'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <UploadEventsDialog
        open={open === 'upload-csv'}
        onOpenChange={() => setOpen('upload-csv')}
      />

      {currentRow && (
        <>
          <EventsMutateDrawer
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
            key='event-delete'
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
              handleDeleteEvent(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Event: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a event{' '}
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
