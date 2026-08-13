import { create } from 'zustand';

interface AppShellState {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  closeMobileDrawer: () => void;
}

export const useAppShell = create<AppShellState>((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
}));
