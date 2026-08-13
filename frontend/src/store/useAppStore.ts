// src/store/useAppStore.ts
// Root Zustand store with devtools and persist middleware.
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Theme } from '@/types'
import { APP_CONSTANTS } from '@/config'

// ─── State Shape ─────────────────────────────────────────────────────────────

interface AppState {
  // UI
  theme: Theme
  sidebarOpen: boolean
  isGlobalLoading: boolean

  // Actions
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setGlobalLoading: (loading: boolean) => void
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial State
        theme: 'dark',
        sidebarOpen: true,
        isGlobalLoading: false,

        // Actions
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open
          }),

        setGlobalLoading: (loading) =>
          set((state) => {
            state.isGlobalLoading = loading
          }),
      })),
      {
        name: APP_CONSTANTS.THEME_KEY,
        partialize: (state) => ({ theme: state.theme }),
      },
    ),
    { name: 'AppStore' },
  ),
)
