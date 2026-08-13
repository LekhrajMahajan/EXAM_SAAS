import React, { createContext, useContext, useState } from 'react';
import type { ThemeMode } from '../types';

interface AppShellContextType {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (v: boolean) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
}

const AppShellContext = createContext<AppShellContextType | undefined>(undefined);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <AppShellContext.Provider
      value={{
        isSidebarCollapsed,
        setSidebarCollapsed,
        isMobileDrawerOpen,
        setMobileDrawerOpen,
        theme,
        setTheme,
        isCommandPaletteOpen,
        setCommandPaletteOpen
      }}
    >
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return context;
}
