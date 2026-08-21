import React from 'react';
import { useAppShell } from '../../providers/AppShellProvider';
import { Menu, X, Command, Bell, Search, User, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/features/dashboard/api/dashboard.api';

export function AppHeader() {
  const { isSidebarCollapsed, setSidebarCollapsed, setMobileDrawerOpen, setCommandPaletteOpen } = useAppShell();
  
  const { data } = useQuery({
    queryKey: ['dashboard', 'role-stats'],
    queryFn: dashboardApi.getRoleDashboardStats,
    staleTime: 3 * 60 * 1000,
  });
  
  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || notifications.filter(n => !n.isRead).length;

  const getIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="hidden md:flex p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <button 
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={() => setMobileDrawerOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">PracticeExam</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl px-8 hidden md:block">
        <button 
          className="w-full h-10 px-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between text-slate-400 transition-colors"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search anywhere...</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 text-slate-500" onClick={() => setCommandPaletteOpen(true)}>
          <Search className="w-5 h-5" />
        </button>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2D3E2C] rounded-full border-2 border-white"></span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-3 border-b border-slate-100 font-bold text-slate-800 flex justify-between items-center">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-slate-50/50' : ''}`}>
                    <div className="flex gap-3">
                      <div className="mt-0.5">{getIcon(notif.priority)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                          <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-[#2D3E2C] mt-1.5 shrink-0" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 cursor-pointer">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
