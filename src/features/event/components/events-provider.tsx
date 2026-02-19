import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Event } from '../data/schema'

type EventsDialogType = 'create' | 'update' | 'delete' | 'edit' | 'upload-csv'

type EventsContextType = {
  open: EventsDialogType | null
  setOpen: (str: EventsDialogType | null) => void
  currentRow: Event | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Event | null>>
}

const EventsContext = React.createContext<EventsContextType | null>(null)

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<EventsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Event | null>(null)

  return (
    <EventsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EventsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEvents = () => {
  const eventsContext = React.useContext(EventsContext)

  if (!eventsContext) {
    throw new Error('useEvents has to be used within <EventsContext>')
  }

  return eventsContext
}
