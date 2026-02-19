import { useState } from 'react'
import { useEvents } from '@/hooks/use-events'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Events } from './components/events'
import { EventsDialogs } from './components/events-dialogs'
import { EventsPrimaryButtons } from './components/events-primary-buttons'
import { EventsProvider } from './components/events-provider'

export function EventsView() {
  const [eventPage, setEventPage] = useState(0)
  const [eventPageSize, setEventPageSize] = useState(10)

  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)
  const [selectedLodge, setSelectedLodge] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const { data: events = null, isLoading: isFetchingEvents } = useEvents(
    searchKeyword || '',
    selectedLodge || '',
    selectedStatus || '',
    selectedCountry || '',
    selectedCity || ''
  )

  const eventsData = events?.data
  const totalEventPages = events?.pagination.totalPages || 0

  return (
    <EventsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isFetchingEvents ? (
          <InfoSkeleton />
        ) : (
          <>
            <div className='mb-0 flex items-center justify-between space-y-2'>
              <div className='m-0'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>Events</h2>
                </div>

                <p className='text-muted-foreground'>Manage your events here</p>
              </div>
              <div className='flex items-center space-x-2'>
                <EventsPrimaryButtons
                  selectedLodge={selectedLodge}
                  setSelectedLodge={setSelectedLodge}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              </div>
            </div>
          </>
        )}

        <Events
          data={eventsData || []}
          page={eventPage}
          pageSize={eventPageSize}
          totalPages={totalEventPages}
          onPageChange={setEventPage}
          onPageSizeChange={setEventPageSize}
          setSearchKeyword={setSearchKeyword}
        />
      </Main>

      <EventsDialogs />
    </EventsProvider>
  )
}
