import { useEffect, useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateEvent, useEvent, useUpdateEvent } from '@/hooks/use-events'
import { useLodges } from '@/hooks/use-lodges'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Event } from '../data/schema'

type FormMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Event
}

const statusesData = [
  { id: 1, title: 'Draft' },
  { id: 2, title: 'Published' },
  { id: 3, title: 'Cancelled' },
  { id: 4, title: 'Completed' },
]

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: 'Event name must be at least 2 characters.' })
      .max(120, { message: 'Event name must not exceed 120 characters.' }),

    eventDescription: z
      .string()
      .max(800, { message: 'Description must not exceed 800 characters.' })
      .optional(),

    start_at: z
      .string()
      .min(1, { message: 'Start date & time is required.' })
      .refine(
        (val) => {
          const date = new Date(val)
          return !isNaN(date.getTime())
        },
        { message: 'Invalid date format' }
      ),

    end_at: z
      .string()
      .min(1, { message: 'End date & time is required.' })
      .refine(
        (val) => {
          const date = new Date(val)
          return !isNaN(date.getTime())
        },
        { message: 'Invalid date format' }
      ),

    lodge: z.string().min(1, { message: 'Please select a lodge.' }),

    status: z.string().min(1),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_at)
      const end = new Date(data.end_at)
      return end > start
    },
    {
      message: 'End date & time must be after start date & time',
      path: ['end_at'],
    }
  )

export type EventFormValues = z.infer<typeof formSchema>

export function EventsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: FormMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      eventDescription: '',
      start_at: '',
      end_at: '',
      lodge: '',
      status: undefined as any,
    },
  })

  const [selectedLodgeId, setSelectedLodgeId] = useState<number | null>(null)

  const [lodgeKeyword, setLodgeKeyword] = useState('')
  const [debouncedLodgeKeyword, setDebouncedLodgeKeyword] = useState('')

  const [statusKeyword, setStatusKeyword] = useState('')

  const { data: lodges, isLoading: loadingLodges }: any = useLodges(
    debouncedLodgeKeyword,
    '',
    ''
  )

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedLodgeKeyword(lodgeKeyword),
      500
    )
    return () => clearTimeout(handler)
  }, [lodgeKeyword])

  useEffect(() => {
    if (!open || !currentRow?.id) return

    console.log('Fetching event for id:', currentRow.id)
    refetchEvent()
  }, [open, currentRow?.id])

  const {
    data: event,
    isPending: isEventLoading,
    refetch: refetchEvent,
  } = useEvent(currentRow?.id?.toString() || '')

  useEffect(() => {
    if (!event || !open) return

    setSelectedLodgeId(event.lodge_id)

    form.reset({
      title: event.title || '',
      eventDescription: event.description || '',
      start_at: event.start_at ? new Date(event.start_at).toISOString() : '',
      end_at: event.end_at ? new Date(event.end_at).toISOString() : '',
      lodge: event.lodge_name || '',
      status: event.status as any,
    })
  }, [event, open, form])

  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()

  const onSubmit = (data: any) => {
    console.log(data)
    if (isUpdate) {
      updateEventMutation.mutate({
        id: currentRow?.id?.toString(),
        payload: {
          title: data?.title,
          description: data.eventDescription,
          start_at: data?.start_at,
          end_at: data?.end_at,
          status: data?.status.toLowerCase(),
          lodge_id: selectedLodgeId,
        },
      })
    } else {
      createEventMutation.mutate({
        title: data?.title,
        description: data.eventDescription,
        start_at: data?.start_at,
        end_at: data?.end_at,
        status: data?.status.toLowerCase(),
        lodge_id: selectedLodgeId,
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Event</SheetTitle>
        </SheetHeader>

        {isUpdate && isEventLoading ? (
          <div className='flex flex-1 items-center justify-center py-10'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
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
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter event name' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='eventDescription'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter event description'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='start_at'
                  render={({ field }) => {
                    const date = field.value ? new Date(field.value) : undefined

                    return (
                      <FormItem className='flex w-full flex-col md:col-span-2'>
                        <FormLabel>Start Date & Time</FormLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'justify-start text-left font-normal',
                                  !date && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {date ? format(date, 'PPP p') : 'Pick a date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className='w-auto space-y-3 p-4'>
                            <Calendar
                              mode='single'
                              selected={date}
                              onSelect={(selectedDate) => {
                                if (!selectedDate) return

                                const newDate = date ?? new Date()
                                selectedDate.setHours(
                                  newDate.getHours(),
                                  newDate.getMinutes()
                                )

                                field.onChange(selectedDate.toISOString())
                              }}
                              initialFocus
                            />

                            {/* Time Picker */}
                            <input
                              type='time'
                              className='w-full rounded-md border px-2 py-1'
                              value={date ? format(date, 'HH:mm') : ''}
                              onChange={(e) => {
                                if (!date) return

                                const [hours, minutes] =
                                  e.target.value.split(':')
                                const updated = new Date(date)
                                updated.setHours(Number(hours))
                                updated.setMinutes(Number(minutes))

                                field.onChange(updated.toISOString())
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name='end_at'
                  render={({ field }) => {
                    const endDate = field.value
                      ? new Date(field.value)
                      : undefined
                    const startValue = form.getValues('start_at')
                    const startDate = startValue
                      ? new Date(startValue)
                      : undefined

                    return (
                      <FormItem className='flex w-full flex-col md:col-span-2'>
                        <FormLabel>End Date & Time</FormLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !endDate && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {endDate
                                  ? format(endDate, 'PPP p')
                                  : 'Pick end date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent
                            align='start'
                            className='w-[--radix-popover-trigger-width] space-y-3 p-4'
                          >
                            <Calendar
                              mode='single'
                              selected={endDate}
                              disabled={(date) =>
                                startDate ? date < startDate : false
                              }
                              onSelect={(selectedDate) => {
                                if (!selectedDate) return

                                const base = endDate ?? startDate ?? new Date()

                                selectedDate.setHours(
                                  base.getHours(),
                                  base.getMinutes()
                                )

                                field.onChange(selectedDate.toISOString())
                              }}
                              initialFocus
                            />

                            <input
                              type='time'
                              className='w-full rounded-md border px-2 py-1'
                              value={endDate ? format(endDate, 'HH:mm') : ''}
                              onChange={(e) => {
                                if (!endDate) return

                                const [hours, minutes] =
                                  e.target.value.split(':')
                                const updated = new Date(endDate)
                                updated.setHours(Number(hours))
                                updated.setMinutes(Number(minutes))

                                field.onChange(updated.toISOString())
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name='lodge'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>Lodge</FormLabel>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className='w-full justify-between'
                            >
                              {field.value ||
                                (loadingLodges ? 'Loading...' : 'Select lodge')}
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className='w-full p-0'>
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
                                    field.onChange(lodge.title)
                                    setSelectedLodgeId(lodge.id)
                                  }}
                                >
                                  {lodge.title}
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

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              role='combobox'
                              className='w-full justify-between'
                            >
                              {field.value || 'Select status'}
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className='w-full p-0'>
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
                                    field.onChange(status.title)
                                  }}
                                >
                                  {status.title}
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
              </div>
            </form>
          </Form>
        )}

        <SheetFooter className='mt-1 gap-2 border-t pt-4'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>

          <Button
            form='forms-form'
            type='submit'
            disabled={
              createEventMutation.isPending || updateEventMutation.isPending
            }
          >
            {(createEventMutation.isPending ||
              updateEventMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
