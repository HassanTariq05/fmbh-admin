import { useEffect, useState } from 'react'
import { useLodges } from '@/hooks/use-lodges'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Lodges } from './components/lodges'
import { LodgesDialogs } from './components/lodges-dialogs'
import { LodgesPrimaryButtons } from './components/lodges-primary-buttons'
import { LodgesProvider } from './components/lodges-provider'

export function LodgesView() {
  const [lodgePage, setLodgePage] = useState(0)
  const [lodgePageSize, setLodgePageSize] = useState(10)

  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const { data: lodgesData = null, isLoading: isFetchingLodges } = useLodges(
    searchKeyword || '',
    selectedCountry || '',
    selectedCity || ''
  )

  useEffect(() => {
    console.log('Search lodges: ', searchKeyword)
  }, [searchKeyword])

  const totalLodgePages = lodgesData?.totalPages || 0

  return (
    <LodgesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isFetchingLodges ? (
          <InfoSkeleton />
        ) : (
          <>
            <div className='mb-0 flex items-center justify-between space-y-2'>
              <div className='m-0'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>Lodges</h2>
                </div>

                <p className='text-muted-foreground'>Manage your lodges here</p>
              </div>
              <div className='flex items-center space-x-2'>
                <LodgesPrimaryButtons
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              </div>
            </div>
          </>
        )}

        <Lodges
          data={lodgesData || []}
          page={lodgePage}
          pageSize={lodgePageSize}
          totalPages={totalLodgePages}
          onPageChange={setLodgePage}
          onPageSizeChange={setLodgePageSize}
          setSearchKeyword={setSearchKeyword}
        />
      </Main>

      <LodgesDialogs />
    </LodgesProvider>
  )
}
