import FreemasonResourceLogo from '@/assets/freemason-resource.svg'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()

  const { state } = useSidebar()

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      {state === 'expanded' && (
        <SidebarHeader>
          <div className='flex items-center gap-3 px-1'>
            <img
              src={FreemasonResourceLogo}
              alt='Freemason Resource App Logo'
              className='h-12 w-auto'
            />
            <p className='text-foreground text-md font-semibold tracking-tight'>
              Freemason Resource
            </p>
          </div>
        </SidebarHeader>
      )}

      {state === 'collapsed' && (
        <SidebarHeader>
          {/* <TeamSwitcher teams={dynamicSidebarData.teams} /> */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={FreemasonResourceLogo}
              alt='Freemason Resource App Logo'
              style={{ height: '32px', width: 'auto' }}
            />
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={dynamicSidebarData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
