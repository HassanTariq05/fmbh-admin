import { useEffect, useState } from 'react'
import { useCities } from '@/hooks/use-cities'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Cities } from './components/cities'
import { CitiesDialogs } from './components/cities-dialogs'
import { CitiesPrimaryButtons } from './components/cities-primary-buttons'
import { CitiesProvider } from './components/cities-provider'

export function CitiesView() {
  const [cityPage, setLodgePage] = useState(0)
  const [cityPageSize, setLodgePageSize] = useState(10)

  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)

  const [debouncedKeyword, setDebouncedKeyword] = useState(searchKeyword)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchKeyword])

  const {
    data: citiesData = [],
    isFetching,
    refetch,
  } = useCities(debouncedKeyword || '')

  useEffect(() => {
    refetch()
  }, [debouncedKeyword, refetch])

  useEffect(() => {
    console.log('Search cities: ', searchKeyword)
  }, [searchKeyword])

  return (
    <CitiesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isFetching && citiesData.length === 0 ? (
          <InfoSkeleton />
        ) : (
          <>
            <div className='mb-0 flex items-center justify-between space-y-2'>
              <div className='m-0'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>Cities</h2>
                </div>

                <p className='text-muted-foreground'>Manage your cities here</p>
              </div>
              <div className='flex items-center space-x-2'>
                <CitiesPrimaryButtons />
              </div>
            </div>
          </>
        )}

        <Cities
          data={citiesData || []}
          page={cityPage}
          pageSize={cityPageSize}
          totalPages={0}
          onPageChange={setLodgePage}
          onPageSizeChange={setLodgePageSize}
          setSearchKeyword={setSearchKeyword}
        />
      </Main>

      <CitiesDialogs />
    </CitiesProvider>
  )
}
