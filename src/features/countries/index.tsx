import { useEffect, useState } from 'react'
import { useCountries } from '@/hooks/use-countries'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Countries } from './components/countries'
import { CountriesDialogs } from './components/countries-dialogs'
import { CountriesPrimaryButtons } from './components/countries-primary-buttons'
import { CountriesProvider } from './components/countries-provider'

export function CountriesView() {
  const [countryPage, setLodgePage] = useState(0)
  const [countryPageSize, setLodgePageSize] = useState(10)

  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)

  const [debouncedKeyword, setDebouncedKeyword] = useState(searchKeyword)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchKeyword])

  const {
    data: countriesData = [],
    isFetching,
    refetch,
  } = useCountries(debouncedKeyword || '')

  useEffect(() => {
    refetch()
  }, [debouncedKeyword, refetch])

  useEffect(() => {
    console.log('Search countries: ', searchKeyword)
  }, [searchKeyword])

  return (
    <CountriesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isFetching && countriesData.length === 0 ? (
          <InfoSkeleton />
        ) : (
          <>
            <div className='mb-0 flex items-center justify-between space-y-2'>
              <div className='m-0'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    Countries
                  </h2>
                </div>

                <p className='text-muted-foreground'>
                  Manage your countries here
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <CountriesPrimaryButtons />
              </div>
            </div>
          </>
        )}

        <Countries
          data={countriesData || []}
          page={countryPage}
          pageSize={countryPageSize}
          totalPages={0}
          onPageChange={setLodgePage}
          onPageSizeChange={setLodgePageSize}
          setSearchKeyword={setSearchKeyword}
        />
      </Main>

      <CountriesDialogs />
    </CountriesProvider>
  )
}
