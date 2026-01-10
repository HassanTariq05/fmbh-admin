'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCountries as contryProvidor } from './countries-provider'

export function CountriesPrimaryButtons() {
  const { setOpen } = contryProvidor()

  return (
    <div className='flex items-center gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Country</span> <Plus size={18} />
      </Button>
    </div>
  )
}
