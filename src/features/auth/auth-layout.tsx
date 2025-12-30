// import { Logo } from '@/assets/logo'
import Logo from '@/assets/freemason-resource.svg'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          {/* <Logo className='me-2' />
          <h1 className='text-xl font-medium'>Shadcn Admin</h1> */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={Logo}
              alt='Freemason Resource App Logo'
              style={{ height: '52px', width: 'auto' }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
