'use client'

import { useState, useEffect } from 'react'
import { Filter, Plus, X } from 'lucide-react'
import { useCity, useCountries } from '@/hooks/use-lodges'
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
import { useLodges } from './lodges-provider'

interface Props {
  selectedCountry: string | null
  setSelectedCountry: (value: string | null) => void
  selectedCity: string | null
  setSelectedCity: (value: string | null) => void
}

export function LodgesPrimaryButtons({
  selectedCity,
  setSelectedCity,
  selectedCountry,
  setSelectedCountry,
}: Props) {
  const { setOpen } = useLodges()

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)

  const [countryKeyword, setCountryKeyword] = useState('')
  const [debouncedCountryKeyword, setDebouncedCountryKeyword] = useState('')

  const [cityKeyword, setCityKeyword] = useState('')
  const [debouncedCityKeyword, setDebouncedCityKeyword] = useState('')

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

  const { data: cities, isLoading: loadingCities }: any = useCity(
    debouncedCityKeyword,
    selectedCountry || '',
    ''
  )

  return (
    <div className='flex items-center gap-2'>
      {/* Country Dropdown */}
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

      {/* Country X icon outside */}
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

      {/* City Dropdown */}
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

      {/* City X icon outside */}
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

      {/* Create Lodge Button */}
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Lodge</span> <Plus size={18} />
      </Button>
    </div>
  )
}
