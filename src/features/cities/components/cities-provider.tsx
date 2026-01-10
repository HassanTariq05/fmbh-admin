import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type City } from '../data/schema'

type CitiesDialogType = 'create' | 'update' | 'delete' | 'edit'

type CitiesContextType = {
  open: CitiesDialogType | null
  setOpen: (str: CitiesDialogType | null) => void
  currentRow: City | null
  setCurrentRow: React.Dispatch<React.SetStateAction<City | null>>
}

const CitiesContext = React.createContext<CitiesContextType | null>(null)

export function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CitiesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<City | null>(null)

  return (
    <CitiesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CitiesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCities = () => {
  const citiesContext = React.useContext(CitiesContext)

  if (!citiesContext) {
    throw new Error('useCities has to be used within <CitiesContext>')
  }

  return citiesContext
}
