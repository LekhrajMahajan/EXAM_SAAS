import React from 'react';
import { AppHeader } from '../header/AppHeader';
import { AppSidebar } from '../sidebar/AppSidebar';
import { MobileDrawer } from '../mobile/MobileDrawer';
import { CommandPalette } from '../command-palette/CommandPalette';
import type { MenuGroup } from '../../types';
import { AppShellProvider } from '../../providers/AppShellProvider';

interface MainLayoutProps {
  children: React.ReactNode;
  menuGroups?: MenuGroup[];
}

// Default placeholder menus if none provided
const DEFAULT_MENUS: MenuGroup[] = [
  {
    id: 'main',
    title: 'Main Menu',
    items: [
      { id: 'dashboard', title: 'Dashboard', icon: 'LayoutDashboard' },
      { id: 'analytics', title: 'Analytics', icon: 'PieChart' },
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'profile', title: 'Profile', icon: 'User' },
      { id: 'system', title: 'System', icon: 'Settings' },
    ]
  }
];

export function MainLayoutContent({ children, menuGroups = DEFAULT_MENUS }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AppSidebar menuGroups={menuGroups} />
      <MobileDrawer menuGroups={menuGroups} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AppHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        
        <CommandPalette />
      </div>
    </div>
  );
}

export function MainLayout(props: MainLayoutProps) {
  return (
    <AppShellProvider>
      <MainLayoutContent {...props} />
    </AppShellProvider>
  );
}
