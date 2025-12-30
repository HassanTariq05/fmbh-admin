import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Please enter your password'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'demo.user@fmbh.com',
      password: '12345678',
    },
  })

  async function onSubmit() {
    const demoUserData = {
      email: 'demo.user@fmbh.com',
      id: 'cbfe0513-067f-4e7b-9215-daa9f6c88457',
      name: 'Demo User',
      phoneNumber: '+222',
      status: 'active',
    }

    auth.setUser(demoUserData as any)
    toast.success(`Welcome back, Demo User!`)
    const target = '/lodges'
    navigate({ to: target, replace: true })
    // loginMutation.mutate(values, {
    //   onSuccess: (res: any) => {
    //     auth.setUser(res.user)
    //     auth.setAccessToken(res.token)

    //     toast.success(`Welcome back, ${res.user.name}!`)

    //     const target = '/'
    //     navigate({ to: target, replace: true })
    //   },
    //   onError: () => {
    //     toast.error('Invalid email or password.')
    //   },
    // })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />

              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        <Button className='mt-2'>
          <LogIn />
          Sign in
        </Button>
      </form>
    </Form>
  )
}
