'use client'

import { useState, useEffect } from 'react'
import { Filter, Plus, X } from 'lucide-react'
import { useCity, useCountries, useLodges } from '@/hooks/use-lodges'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEvents } from './events-provider'

interface Props {
  selectedLodge: string | null
  setSelectedLodge: (value: string | null) => void
  selectedStatus: string | null
  setSelectedStatus: (value: string | null) => void
  selectedCountry: string | null
  setSelectedCountry: (value: string | null) => void
  selectedCity: string | null
  setSelectedCity: (value: string | null) => void
}

const statusesData = [
  { id: 1, title: 'Draft' },
  { id: 2, title: 'Published' },
  { id: 3, title: 'Cancelled' },
  { id: 4, title: 'Completed' },
]

export function EventsPrimaryButtons({
  selectedLodge,
  setSelectedLodge,
  selectedStatus,
  setSelectedStatus,
  selectedCity,
  setSelectedCity,
  selectedCountry,
  setSelectedCountry,
}: Props) {
  const { setOpen } = useEvents()

  const [lodgeDropdownOpen, setLodgeDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  const [lodgeKeyword, setLodgeKeyword] = useState('')
  const [debouncedLodgeKeyword, setDebouncedLodgeKeyword] = useState('')

  const [statusKeyword, setStatusKeyword] = useState('')

  const [countryKeyword, setCountryKeyword] = useState('')
  const [debouncedCountryKeyword, setDebouncedCountryKeyword] = useState('')

  const [cityKeyword, setCityKeyword] = useState('')
  const [debouncedCityKeyword, setDebouncedCityKeyword] = useState('')

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedLodgeKeyword(lodgeKeyword),
      500
    )
    return () => clearTimeout(handler)
  }, [lodgeKeyword])

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedCountryKeyword(countryKeyword),
      500
    )
    return () => clearTimeout(handler)
  }, [countryKeyword])

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedCityKeyword(cityKeyword), 500)
    return () => clearTimeout(handler)
  }, [cityKeyword])

  const { data: countries, isLoading: loadingCountries }: any = useCountries(
    debouncedCountryKeyword,
    '',
    ''
  )

  const { data: lodges, isLoading: loadingLodges }: any = useLodges(
    debouncedLodgeKeyword,
    selectedCountry || '',
    selectedCity || ''
  )

  const { data: cities, isLoading: loadingCities }: any = useCity(
    debouncedCityKeyword,
    selectedCountry || '',
    ''
  )

  return (
    <div className='flex items-center gap-2'>
      <Filter size={18} />

      <div className='relative flex-1'>
        <DropdownMenu
          open={countryDropdownOpen}
          onOpenChange={setCountryDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full'>
              {selectedCountry ||
                (loadingCountries ? 'Loading...' : 'Select Country')}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-full'>
            <Command>
              <CommandInput
                placeholder='Search country...'
                value={countryKeyword}
                onValueChange={setCountryKeyword}
              />
              <CommandList>
                <CommandEmpty>No countries found.</CommandEmpty>
                {countries?.map((country: any) => (
                  <CommandItem
                    key={country.id}
                    onSelect={() => {
                      setSelectedCountry(country.title)
                      setSelectedCity(null)
                      setCityKeyword('')
                      setCountryDropdownOpen(false)
                    }}
                  >
                    {country.title}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCountry && (
        <X
          size={16}
          className='cursor-pointer'
          onClick={() => {
            setSelectedCountry('')
            setSelectedCity('')
            setCountryKeyword('')
            setCityKeyword('')
          }}
        />
      )}

      <div className='relative flex-1'>
        <DropdownMenu
          open={cityDropdownOpen}
          onOpenChange={setCityDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              disabled={!selectedCountry}
              className='w-full'
            >
              {selectedCity || (loadingCities ? 'Loading...' : 'Select City')}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-full'>
            <Command>
              <CommandInput
                placeholder='Search city...'
                value={cityKeyword}
                onValueChange={setCityKeyword}
              />
              <CommandList>
                <CommandEmpty>No cities found.</CommandEmpty>
                {cities?.map((city: any) => (
                  <CommandItem
                    key={city.id}
                    onSelect={() => {
                      setSelectedCity(city.title)
                      setCityDropdownOpen(false)
                    }}
                  >
                    {city.title}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCity && (
        <X
          size={16}
          className='cursor-pointer'
          onClick={() => {
            setSelectedCity('')
            setCityKeyword('')
          }}
        />
      )}

      <div className='relative flex-1'>
        <DropdownMenu
          open={lodgeDropdownOpen}
          onOpenChange={setLodgeDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full'>
              {selectedLodge || (loadingLodges ? 'Loading...' : 'Select Lodge')}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-full'>
            <Command>
              <CommandInput
                placeholder='Search lodge...'
                value={lodgeKeyword}
                onValueChange={setLodgeKeyword}
              />
              <CommandList>
                <CommandEmpty>No lodges found.</CommandEmpty>
                {lodges?.map((lodge: any) => (
                  <CommandItem
                    key={lodge.id}
                    onSelect={() => {
                      setSelectedLodge(lodge.title)
                    }}
                  >
                    {lodge.title}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedLodge && (
        <X
          size={16}
          className='cursor-pointer'
          onClick={() => {
            setSelectedLodge('')
          }}
        />
      )}

      <div className='relative flex-1'>
        <DropdownMenu
          open={statusDropdownOpen}
          onOpenChange={setStatusDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full'>
              {selectedStatus || 'Select Status'}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-full'>
            <Command>
              <CommandInput
                placeholder='Search status...'
                value={statusKeyword}
                onValueChange={setStatusKeyword}
              />
              <CommandList>
                <CommandEmpty>No statuses found.</CommandEmpty>
                {statusesData?.map((status: any) => (
                  <CommandItem
                    key={status.id}
                    onSelect={() => {
                      setSelectedStatus(status.title)
                    }}
                  >
                    {status.title}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedStatus && (
        <X
          size={16}
          className='cursor-pointer'
          onClick={() => {
            setSelectedStatus('')
          }}
        />
      )}

      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Event</span> <Plus size={18} />
      </Button>
    </div>
  )
}
