import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  drawerOpen: boolean;
  activeModal: string | null;
  globalLoading: boolean;
  globalSearchQuery: string;
  
  toggleSidebar: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setGlobalLoading: (isLoading: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  drawerOpen: false,
  activeModal: null,
  globalLoading: false,
  globalSearchQuery: '',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setDrawerOpen: (isOpen) => set({ drawerOpen: isOpen }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
}));
