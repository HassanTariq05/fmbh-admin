import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import {
  useCity,
  useCountries,
  useCreateLodge,
  useLodge,
  useUpdateLodge,
} from '@/hooks/use-lodges'
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
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { type Lodge } from '../data/schema'

type FormMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Lodge
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Lodge name must be at least 2 characters.')
    .max(60, 'Lodge name must not be longer than 60 characters.'),
  lodgeNumber: z
    .string()
    .min(1, 'Lodge number must be at least 1 number long.'),
  address: z
    .string()
    .min(1, 'Address is required.')
    .max(60, 'Address must not be longer than 60 characters.'),
  meetingTime: z
    .string()
    .min(1, 'Meeting Time is required.')
    .max(60, 'Meeting Time not be longer than 60 characters.'),

  city: z.string().min(1, 'City is required.'),
  country: z.string().min(1, 'Country is required.'),
})
type FormForm = z.infer<typeof formSchema>

export function LodgesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: FormMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<FormForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      lodgeNumber: undefined,
      address: '',
      meetingTime: '',
      city: '',
      country: '',
    },
  })

  const watchedCountry = form.watch('country')

  // Reset city when country changes
  useEffect(() => {
    if (!watchedCountry) {
      form.setValue('city', '')
    }
  }, [watchedCountry, form])

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

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

  useEffect(() => {
    if (!open || !currentRow?.id) return

    // Fetch lodge only when drawer opens and currentRow exists
    console.log('Fetching lodge for id:', currentRow.id)
    refetchLodge()
  }, [open, currentRow?.id])

  const {
    data: lodge,
    isPending: isLodgeLoading,
    refetch: refetchLodge,
  } = useLodge(currentRow?.id?.toString() || '', { enabled: false })

  useEffect(() => {
    console.log('lodge: ', lodge)
    console.log('open: ', open)
    if (!lodge || !open) return

    let lodgesData = lodge?.data

    form.reset({
      title: lodgesData.lodge_name,
      lodgeNumber: lodgesData?.lodge_number?.toString() || '',
      meetingTime: lodgesData.meeting_time,
      address: lodgesData.address,
      city: lodgesData.city,
      country: lodgesData.country,
    })
  }, [lodge, open])

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

  const createFormMutation = useCreateLodge()
  const updateFormMutation = useUpdateLodge()

  const onSubmit = (data: FormForm) => {
    console.log(data)
    if (isUpdate) {
      updateFormMutation.mutate({
        id: currentRow?.id?.toString(),
        payload: {
          lodge_name: data?.title,
          lodge_number: parseInt(data?.lodgeNumber),
          city: data?.city,
          country: data?.country,
          address: data?.address,
          meeting_time: data?.meetingTime,
        },
      })
    } else {
      createFormMutation.mutate({
        lodge_name: data?.title,
        lodge_number: parseInt(data?.lodgeNumber),
        city: data?.city,
        country: data?.country,
        address: data?.address,
        meeting_time: data?.meetingTime,
      })
    }

    onOpenChange(false)
    form.reset()
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Lodge</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            id='forms-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 overflow-y-auto px-4 py-6'
          >
            <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Lodge Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter lodge name' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lodgeNumber'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Lodge Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter lodge number' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address - full width */}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter address' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='country'
                render={() => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <div className='relative'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className='w-full justify-between'
                            >
                              {form.getValues('country') ||
                                (loadingCountries
                                  ? 'Loading...'
                                  : 'Select country')}
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className='w-full p-0'>
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
                                    form.setValue('country', country.title)
                                    form.setValue('city', '') // Reset city
                                    form.trigger('country')
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
                    <FormMessage />
                    {/* Hidden input to ensure field is registered */}
                    <input type='hidden' {...form.register('country')} />
                  </FormItem>
                )}
              />

              {/* City Dropdown */}
              <FormField
                control={form.control}
                name='city'
                render={() => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <div className='relative'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              disabled={!watchedCountry}
                              className='w-full justify-between'
                            >
                              {form.getValues('city') ||
                                (loadingCities
                                  ? 'Loading...'
                                  : watchedCountry
                                    ? 'Select city'
                                    : 'Select country first')}
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className='w-full p-0'>
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
                                    form.setValue('city', city.title)
                                    form.trigger('city')
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
                    <FormMessage />
                    <input type='hidden' {...form.register('city')} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='meetingTime'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Meeting Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='e.g., 2nd Tuesday at 7:30 PM'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <SheetFooter className='mt-1 gap-2 border-t pt-4'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>

          <Button
            form='forms-form'
            type='submit'
            disabled={
              createFormMutation.isPending || updateFormMutation.isPending
            }
          >
            {(createFormMutation.isPending || updateFormMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
