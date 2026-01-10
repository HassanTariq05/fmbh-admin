import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCreateCountry, useUpdateCountry } from '@/hooks/use-countries'
import { Button } from '@/components/ui/button'
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
import { type Country } from '../data/schema'

type FormMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Country
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Country name must be at least 2 characters.')
    .max(60, 'Country name must not be longer than 60 characters.'),
})

export function CountriesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: FormMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
    },
  })

  const createCountryMutation = useCreateCountry()
  const updateCountryMutation = useUpdateCountry()

  const onSubmit = (data: any) => {
    console.log(data)
    if (isUpdate) {
      updateCountryMutation.mutate({
        id: currentRow?.id?.toString(),
        payload: {
          name: data?.name,
        },
      })
    } else {
      createCountryMutation.mutate({
        name: data?.name,
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Country</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id='countries-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 overflow-y-auto px-4 py-6'
          >
            <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter name' />
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
            form='countries-form'
            type='submit'
            disabled={
              createCountryMutation.isPending || updateCountryMutation.isPending
            }
          >
            {(createCountryMutation.isPending ||
              updateCountryMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
