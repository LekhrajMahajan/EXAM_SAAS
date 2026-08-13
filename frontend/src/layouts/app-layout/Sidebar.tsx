import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import {
  ChevronDown,
  Menu,
  X,
  Search,
  Star,
  Clock,
  LayoutDashboard,
} from 'lucide-react'
import apiClient from '@/core/api/http/axios-client'

import type { IconComponent, SidebarMenuItem } from '@/config/sidebar'
import { cn } from '@/utils/cn'
import { SIDEBAR_MENU } from '@/config/sidebar'
import { useAppShell } from '@/hooks/useAppShell'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserStore } from '@/stores/user/user.store'
import { usePublicSettings } from '@/features/master-admin/hooks/system-settings.hooks'
import { useTheme } from '@/providers/theme-context'
import { Button } from '@/shared/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Sheet, SheetContent } from '@/shared/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface ApiNavItem {
  id?: string
  _id?: string
  title: string
  path?: string
  route?: string
  requiredFeature?: string
  featureKey?: string
  permissionKey?: string
  permissions?: string[]
  requiredRoles?: string[]
  iconName?: string
  icon?: string
  badgeValue?: string | number
  category?: string
  moduleKey?: string
  children?: ApiNavItem[]
}

// Dynamic Lucide icon resolution supporting all icon names stored in MongoDB
const resolveIcon = (name?: string): IconComponent => {
  if (!name) return LayoutDashboard as unknown as IconComponent
  const found = (LucideIcons as Record<string, any>)[name]
  return (found || LayoutDashboard) as unknown as IconComponent
}

export const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar, isMobileDrawerOpen, setMobileDrawerOpen } =
    useAppShell()
  const { user, token, isAuthenticated } = useAuthStore()
  const profile = useUserStore((state) => state.profile)
  const location = useLocation()

  const { data: orgSettings } = usePublicSettings()
  const { theme } = useTheme()

  const [dynamicMenu, setDynamicMenu] = useState<SidebarMenuItem[] | null>(null)
  const [favorites, setFavorites] = useState<SidebarMenuItem[]>([])
  const [recents, setRecents] = useState<SidebarMenuItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchNav = useCallback(async () => {
    const activeToken =
      token || localStorage.getItem('token') || localStorage.getItem('examguard_auth_tokens')
    if (!isAuthenticated || !activeToken || !user?.id) {
      return
    }
    try {
      const res = await apiClient.get('/sidebar/my-navigation')

      const dataObj = res.data?.data
      const menuList: ApiNavItem[] = Array.isArray(dataObj)
        ? dataObj
        : dataObj?.tree || dataObj?.menu || []

      const mapRecursive = (items: ApiNavItem[]): SidebarMenuItem[] =>
        items.map((m: ApiNavItem, idx: number) => ({
          id: m.id || m._id || `item-${idx}`,
          title: m.title,
          path: m.path || m.route || '#',
          requiredFeature: m.requiredFeature || m.featureKey || undefined,
          permissions: m.permissionKey ? [m.permissionKey] : m.permissions || undefined,
          roles: m.requiredRoles && m.requiredRoles.length ? m.requiredRoles : undefined,
          icon: resolveIcon(m.iconName || m.icon),
          badgeValue: m.badgeValue,
          category: m.category || 'Main',
          moduleKey: m.moduleKey,
          children: m.children && m.children.length > 0 ? mapRecursive(m.children) : undefined,
        }))

      if (menuList && menuList.length > 0) {
        const parsedMenu = mapRecursive(menuList)
        setDynamicMenu(parsedMenu)

        if (dataObj?.favorites && Array.isArray(dataObj.favorites)) {
          setFavorites(mapRecursive(dataObj.favorites))
        }
        if (dataObj?.recents && Array.isArray(dataObj.recents)) {
          setRecents(mapRecursive(dataObj.recents))
        }
      }
    } catch {
      // Ignore network/auth failure to avoid spamming logs
    }
  }, [isAuthenticated, token, user?.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchNav()
    }, 0)
    return () => clearTimeout(timer)
  }, [
    fetchNav,
    user?.role,
    profile?.companyId,
    profile?.onboardingCompleted,
    profile?.subscriptionPlan,
  ])

  const roleStr = String(user?.role || '')
  const normalizedUserRole =
    roleStr === 'MASTER_ADMIN' || roleStr === 'Master Admin'
      ? 'Master Admin'
      : roleStr === 'COMPANY_ADMIN' || roleStr === 'Company Admin'
      ? 'Company Admin'
      : roleStr
  const hasSub = !!profile?.subscriptionEndDate
  const isOnboarded = !!profile?.onboardingCompleted

  const isCenterManager = roleStr === 'CENTER_MANAGER'
  const isCenterActive = profile?.centerSetupStatus === 'ACTIVE'

  const activeMenu: SidebarMenuItem[] =
    isCenterManager && !isCenterActive
      ? [] // Hide sidebar menus if center is not yet ACTIVE
      : (profile?.companyId || normalizedUserRole === 'Company Admin' || normalizedUserRole === 'Master Admin') &&
        dynamicMenu &&
        dynamicMenu.length > 0
          ? dynamicMenu
          : SIDEBAR_MENU

  // Search filter matching by Title, Module, or Keyword
  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return activeMenu
    const kw = searchQuery.toLowerCase().trim()

    const filterRecursive = (items: SidebarMenuItem[]): SidebarMenuItem[] => {
      return items
        .map((item) => {
          const matchTitle = item.title.toLowerCase().includes(kw)
          const matchModule = item.moduleKey ? item.moduleKey.toLowerCase().includes(kw) : false
          const matchCat = item.category ? item.category.toLowerCase().includes(kw) : false
          const filteredChildren = item.children ? filterRecursive(item.children) : undefined

          if (matchTitle || matchModule || matchCat || (filteredChildren && filteredChildren.length > 0)) {
            return {
              ...item,
              children: filteredChildren,
            }
          }
          return null
        })
        .filter(Boolean) as SidebarMenuItem[]
    }
    return filterRecursive(activeMenu)
  }, [activeMenu, searchQuery])

  const orgName =
    (orgSettings?.data?.find((s) => s.key === 'ORG_NAME')?.value as string) || 'ExamGuard Pro'
  const orgShortName =
    (orgSettings?.data?.find((s) => s.key === 'ORG_SHORT_NAME')?.value as string) || 'EP'
  const primaryLogo = orgSettings?.data?.find((s) => s.key === 'LOGO_PRIMARY')?.value as string
  const darkLogo = orgSettings?.data?.find((s) => s.key === 'LOGO_DARK')?.value as string
  const lightLogo = orgSettings?.data?.find((s) => s.key === 'LOGO_LIGHT')?.value as string

  const activeTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  const logoUrl = (activeTheme === 'dark' ? darkLogo : lightLogo) || primaryLogo

  const handleToggleCollapse = () => {
    const nextCollapsed = !isSidebarCollapsed
    toggleSidebar()
    if (isAuthenticated && user?.id) {
      apiClient
        .patch('/sidebar/collapse', { collapsedMode: nextCollapsed ? 'collapsed' : 'expanded' })
        .catch(() => {})
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, item: SidebarMenuItem) => {
    e.stopPropagation()
    if (!isAuthenticated || !user?.id) return
    try {
      await apiClient.patch('/sidebar/favorite', { targetKey: item.path })
      void fetchNav()
    } catch {
      // Silently catch error
    }
  }

  const handleItemClick = (item: SidebarMenuItem) => {
    if (!isAuthenticated || !user?.id) return
    apiClient
      .patch('/sidebar/recent', { targetKey: item.path, title: item.title })
      .catch(() => {})
  }

  const renderMenuSection = (items: SidebarMenuItem[], sectionTitle?: string, sectionIcon?: any) => {
    if (!items || items.length === 0) return null
    return (
      <div className='mb-4'>
        {!isSidebarCollapsed && sectionTitle && (
          <div className='flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70'>
            {sectionIcon && <sectionIcon.type {...sectionIcon.props} className='w-3.5 h-3.5 mr-1' />}
            <span>{sectionTitle}</span>
          </div>
        )}
        <div className='space-y-1 mt-1'>
          {items.map((item) => (
            <SidebarItemView
              key={item.id}
              item={item}
              pathname={location.pathname}
              isCollapsed={isSidebarCollapsed}
              userRole={user?.role}
              userPermissions={user?.permissions || []}
              planFeatures={profile?.planFeatures}
              hasSubscription={hasSub}
              onboardingCompleted={isOnboarded}
              onFavoriteToggle={(e) => handleToggleFavorite(e, item)}
              isFavorite={favorites.some((f) => f.id === item.id || f.path === item.path)}
              onClick={() => {
                handleItemClick(item)
                if (isMobileDrawerOpen) setMobileDrawerOpen(false)
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 288 }}
        className='hidden md:block border-r bg-background shrink-0 h-screen sticky top-0 z-40'
      >
        <div className='flex h-full flex-col'>
          <div className='flex h-16 items-center justify-between px-4 border-b shrink-0'>
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className='flex items-center gap-2 overflow-hidden whitespace-nowrap'
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt={orgName} className='h-8 w-8 object-contain rounded-lg' />
                  ) : (
                    <div className='h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold'>
                      {orgShortName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className='font-bold text-lg truncate' title={orgName}>
                    {orgName}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {isSidebarCollapsed &&
              (logoUrl ? (
                <img
                  src={logoUrl}
                  alt={orgName}
                  className='mx-auto h-8 w-8 object-contain rounded-lg'
                />
              ) : (
                <div className='mx-auto h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold'>
                  {orgShortName.substring(0, 2).toUpperCase()}
                </div>
              ))}
          </div>

          {/* Dynamic Search Box */}
          {!isSidebarCollapsed && (
            <div className='p-3 border-b border-slate-100 dark:border-slate-800 shrink-0'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Search menus or modules...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-muted/50 border border-transparent focus:border-primary/40 focus:bg-background outline-none transition-all'
                />
              </div>
            </div>
          )}

          <div className='flex-1 overflow-y-auto py-3 px-2 space-y-2'>
            <TooltipProvider delayDuration={0}>
              {!searchQuery && renderMenuSection(favorites, 'Favorites', <Star />)}
              {!searchQuery && renderMenuSection(recents, 'Recent Menus', <Clock />)}
              {renderMenuSection(filteredMenu, 'Main Navigation')}
            </TooltipProvider>
          </div>

          <div className='p-3 border-t shrink-0'>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    className={cn('w-full justify-start', isSidebarCollapsed ? 'px-2' : 'px-4')}
                    onClick={handleToggleCollapse}
                  >
                    {isSidebarCollapsed ? (
                      <Menu className='h-5 w-5 mx-auto' />
                    ) : (
                      <X className='h-5 w-5 mr-2' />
                    )}
                    {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
                  </Button>
                </TooltipTrigger>
                {isSidebarCollapsed && <TooltipContent side='right'>Expand Sidebar</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <Sheet open={isMobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side='left' className='p-0 w-72 flex flex-col h-full'>
          <div className='flex h-16 items-center px-6 border-b shrink-0'>
            <div className='h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold mr-2'>
              {orgShortName.substring(0, 2).toUpperCase()}
            </div>
            <span className='font-bold text-lg'>{orgName}</span>
          </div>
          <div className='p-3 border-b shrink-0'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
              <input
                type='text'
                placeholder='Search menus or modules...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-muted/50 border border-transparent outline-none'
              />
            </div>
          </div>
          <div className='flex-1 overflow-y-auto py-4 px-2 space-y-2'>
            <TooltipProvider>
              {!searchQuery && renderMenuSection(favorites, 'Favorites', <Star />)}
              {!searchQuery && renderMenuSection(recents, 'Recent Menus', <Clock />)}
              {renderMenuSection(filteredMenu, 'Main Navigation')}
            </TooltipProvider>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface SidebarItemProps {
  item: SidebarMenuItem
  pathname: string
  isCollapsed: boolean
  userRole?: string
  userPermissions: string[]
  planFeatures?: Record<string, boolean>
  hasSubscription?: boolean
  onboardingCompleted?: boolean
  isFavorite?: boolean
  onFavoriteToggle?: (e: React.MouseEvent) => void
  onClick?: () => void
}

const SidebarItemView = ({
  item,
  pathname,
  isCollapsed,
  userRole,
  userPermissions,
  planFeatures,
  hasSubscription = true,
  onboardingCompleted = true,
  isFavorite,
  onFavoriteToggle,
  onClick,
}: SidebarItemProps) => {
  const navigate = useNavigate()
  const isActive = pathname === item.path || (!!item.children && pathname.startsWith(item.path))
  const hasChildren = !!item.children && item.children.length > 0
  const [isOpen, setIsOpen] = useState(isActive && hasChildren)

  const normalizedUserRole =
    userRole === 'MASTER_ADMIN'
      ? 'Master Admin'
      : userRole === 'COMPANY_ADMIN'
      ? 'Company Admin'
      : userRole
  const hasRole =
    !item.roles || (normalizedUserRole && item.roles.includes(normalizedUserRole as string))
  const hasPermission =
    !item.permissions || item.permissions.some((perm) => userPermissions.includes(perm))
  const hasFeature =
    !item.requiredFeature || (planFeatures && planFeatures[item.requiredFeature] === true)

  if (!hasRole || !hasPermission || !hasFeature) return null

  const Icon = item.icon

  const ItemContent = (
    <div
      className={cn(
        'group flex items-center rounded-md px-3 py-2 text-sm transition-all cursor-pointer relative select-none',
        isActive
          ? 'bg-primary/10 text-[#2D3E2C] font-semibold sidebar-active-text shadow-xs'
          : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
        isCollapsed ? 'justify-center' : 'justify-between',
      )}
      onClick={(e) => {
        if (hasChildren) {
          if (!isCollapsed) {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        } else {
          if (onClick) onClick()
          navigate(item.path)
        }
      }}
    >
      <div className='flex items-center gap-2.5 overflow-hidden pr-2'>
        {Icon && <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />}

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className='whitespace-nowrap truncate'
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {!isCollapsed && (
        <div className='flex items-center gap-1.5'>
          {/* Dynamic Badge Pill */}
          {item.badgeValue !== undefined && item.badgeValue !== '' && (
            <span className='px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/20 text-primary shrink-0'>
              {item.badgeValue}
            </span>
          )}

          {/* Favorite Pin Button on Hover */}
          {onFavoriteToggle && !hasChildren && (
            <button
              type='button'
              onClick={onFavoriteToggle}
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10',
                isFavorite && 'opacity-100 text-amber-500 hover:text-amber-600',
              )}
              title={isFavorite ? 'Unpin menu' : 'Pin to favorites'}
            >
              <Star className={cn('h-3.5 w-3.5', isFavorite && 'fill-amber-500')} />
            </button>
          )}

          {hasChildren && (
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          )}
        </div>
      )}
    </div>
  )

  const MainItem = <div className='block'>{ItemContent}</div>

  return (
    <div className='space-y-1'>
      {isCollapsed && hasChildren ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{MainItem}</DropdownMenuTrigger>
          <DropdownMenuContent side='right' align='start' sideOffset={16} className='w-56'>
            <div className='px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b mb-1'>
              {item.title}
            </div>
            {item.children!.map((child) => {
              const ChildIcon = child.icon
              return (
                <DropdownMenuItem
                  key={child.id}
                  onClick={() => {
                    if (onClick) onClick()
                    navigate(child.path)
                  }}
                  className='cursor-pointer flex items-center justify-between'
                >
                  <span className='flex items-center gap-2'>
                    {ChildIcon && <ChildIcon className='h-4 w-4' />}
                    {child.title}
                  </span>
                  {child.badgeValue !== undefined && (
                    <span className='px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-primary/20 text-primary'>
                      {child.badgeValue}
                    </span>
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{MainItem}</TooltipTrigger>
          <TooltipContent side='right' sideOffset={20} className='flex items-center gap-2'>
            <span>{item.title}</span>
            {item.badgeValue !== undefined && (
              <span className='px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-primary/20 text-primary'>
                {item.badgeValue}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      ) : (
        MainItem
      )}

      <AnimatePresence>
        {hasChildren && isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden pl-5 pr-1 space-y-1 border-l ml-3 border-slate-200 dark:border-slate-800'
          >
            {item.children!.map((child) => (
              <SidebarItemView
                key={child.id}
                item={child}
                pathname={pathname}
                isCollapsed={false}
                userRole={userRole}
                userPermissions={userPermissions}
                planFeatures={planFeatures}
                hasSubscription={hasSubscription}
                onboardingCompleted={onboardingCompleted}
                onClick={onClick}
                onFavoriteToggle={(e) => {
                  e.stopPropagation()
                  if (onFavoriteToggle) {
                    // inherit parent toggle behavior or bind directly
                    apiClient.patch('/sidebar/favorite', { targetKey: child.path }).catch(() => {})
                  }
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
