import { useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useCountryService } from '@/services/country-services/country-services'
import { Loader2 } from 'lucide-react'
import { useCreateCity, useUpdateCity } from '@/hooks/use-cities'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'

// ── Schema ───────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(2, 'City name is required.'),
  country: z.string().min(1, 'Please select a country.'),
})

type FormValues = z.infer<typeof formSchema>

interface FormMutateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: {
    id: string | number
    name: string
    country_name?: string // optional if your backend sends it
  } | null
}

export function CitiesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: FormMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name ?? '',
      country: currentRow?.country_name ?? '',
    },
  })

  const [countrySearch, setCountrySearch] = useState('')

  // Better debounce implementation
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [selectedCountryId, setSelectedCountryId] = useState()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(countrySearch.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [countrySearch])

  const { getAll: getCountries } = useCountryService()

  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries', debouncedSearch],
    queryFn: () => getCountries(debouncedSearch),
    placeholderData: keepPreviousData,
    enabled: open && (debouncedSearch.length > 0 || true),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createMutation = useCreateCity()
  const updateMutation = useUpdateCity()

  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: FormValues) => {
    console.log('first', values)
    if (isUpdate) {
      updateMutation.mutate(
        {
          id: currentRow!.id.toString(),
          payload: {
            name: values.name,
            country_id: selectedCountryId,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          name: values.name,
          country_id: selectedCountryId,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) form.reset()
      }}
    >
      <SheetContent className='flex max-w-lg flex-col sm:max-w-sm'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} City</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            id='cities-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4 py-5'
          >
            {/* City Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter city name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country Combobox */}
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-1.5'>
                  <FormLabel>Country *</FormLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='w-full justify-between text-left font-normal'
                          disabled={loadingCountries}
                        >
                          {field.value || 'Select country...'}
                          {loadingCountries && (
                            <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                          )}
                        </Button>
                      </FormControl>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className='max-h-[300px] w-[var(--radix-dropdown-menu-trigger-width)] p-0'>
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder='Search country...'
                          value={countrySearch}
                          onValueChange={setCountrySearch}
                        />
                        <CommandList className='max-h-[240px] overflow-auto'>
                          <CommandEmpty>
                            {loadingCountries
                              ? 'Loading countries...'
                              : 'No countries found.'}
                          </CommandEmpty>

                          {countries.map((country: any) => (
                            <CommandItem
                              key={country.id}
                              value={country.id}
                              onSelect={() => {
                                form.setValue('country', country.name, {
                                  shouldValidate: true,
                                })
                                setSelectedCountryId(country.id)
                                setCountrySearch('')
                              }}
                            >
                              {country.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='mt-4 border-t pt-4'>
          <SheetClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </SheetClose>

          <Button
            form='cities-form'
            type='submit'
            disabled={isPending || !form.formState.isValid}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isUpdate ? 'Update' : 'Create'} City
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
