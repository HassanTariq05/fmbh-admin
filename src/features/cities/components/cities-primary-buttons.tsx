'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCities as contryProvidor } from './cities-provider'

export function CitiesPrimaryButtons() {
  const { setOpen } = contryProvidor()

  return (
    <div className='flex items-center gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create City</span> <Plus size={18} />
      </Button>
    </div>
  )
}
