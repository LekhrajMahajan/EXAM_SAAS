// src/store/theme.store.ts — theme preference slice
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'

  setMode: (mode: ThemeMode) => void
  setResolvedMode: (mode: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      immer((set) => ({
        mode: 'dark',
        resolvedMode: 'dark',

        setMode: (mode) =>
          set((s) => {
            s.mode = mode
          }),

        setResolvedMode: (mode) =>
          set((s) => {
            s.resolvedMode = mode
          }),
      })),
      {
        name: 'theme-store',
        partialize: (state) => ({ mode: state.mode }),
      },
    ),
    { name: 'ThemeStore' },
  ),
)
