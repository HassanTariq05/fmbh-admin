import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Lodge } from '../data/schema'

type LodgesDialogType = 'create' | 'update' | 'delete' | 'edit' | 'upload-csv'

type LodgesContextType = {
  open: LodgesDialogType | null
  setOpen: (str: LodgesDialogType | null) => void
  currentRow: Lodge | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Lodge | null>>
}

const LodgesContext = React.createContext<LodgesContextType | null>(null)

export function LodgesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LodgesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Lodge | null>(null)

  return (
    <LodgesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LodgesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLodges = () => {
  const lodgesContext = React.useContext(LodgesContext)

  if (!lodgesContext) {
    throw new Error('useLodges has to be used within <LodgesContext>')
  }

  return lodgesContext
}
