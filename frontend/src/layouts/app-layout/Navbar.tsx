import { useState } from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, Moon, Sun, User as UserIcon, Settings, LogOut } from "lucide-react";
import { useAppShell } from "@/hooks/useAppShell";
import { useTheme } from "@/providers/theme-context";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/shared/components/ui/breadcrumb";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { useRoleDashboard } from '@/features/dashboard/hooks/dashboard.hooks';

export const Navbar = () => {
  const { toggleMobileDrawer } = useAppShell();
  const { theme, setTheme } = useTheme();
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: dashboardData } = useRoleDashboard();
  const unreadCount = dashboardData?.unreadCount || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.warn('Searching for:', searchQuery);
    }
  };

  const getProfileLink = (role?: string) => {
    switch (role) {
      case 'Master Admin': return '/master-admin/profile';
      case 'Company Admin': return '/company/profile';
      case 'Candidate': return '/candidate/profile';
      default: return '/profile';
    }
  };

  const getSettingsLink = (role?: string) => {
    switch (role) {
      case 'Master Admin': return '/master-admin/system-settings';
      case 'Company Admin': return '/company/settings';
      case 'Candidate': return '/candidate/settings';
      default: return '/settings';
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Generate simple breadcrumbs from pathname, skipping MongoDB Object IDs
  const rawPaths = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = rawPaths.map((path, index) => {
    // Check if it's a 24-character hex string (MongoDB ObjectId)
    if (/^[a-fA-F0-9]{24}$/.test(path)) {
      return null;
    }
    
    return {
      path,
      href: `/${rawPaths.slice(0, index + 1).join('/')}`,
      title: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    };
  }).filter(Boolean) as { path: string, href: string, title: string }[];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={toggleMobileDrawer}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      <div className="flex-1 hidden sm:flex">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <div key={item.path} className="flex items-center gap-1.5 sm:gap-2.5">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.href}>{item.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <form onSubmit={handleSearch} className="hidden lg:flex relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-background pl-8 sm:w-[300px]"
          />
        </form>

        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full shrink-0"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0 relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs font-medium bg-rose-100 text-rose-600 rounded-full px-2 py-0.5">{unreadCount} unread</span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {(dashboardData?.notifications ?? []).length > 0 ? (
                (dashboardData?.notifications ?? []).slice(0, 5).map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.timestamp}</p>
                      </div>
                      {!n.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-2 p-4 text-sm text-center text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p>No new notifications</p>
                  <p className="text-xs">You&apos;re all caught up!</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0 h-9 w-9 border">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={getProfileLink(user?.role)}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={getSettingsLink(user?.role)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-100 dark:focus:bg-red-900/20">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
