// src/store/sidebar.store.ts — sidebar collapse/expand state
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  activeKey: string | null

  toggle: () => void
  setOpen: (open: boolean) => void
  setCollapsed: (collapsed: boolean) => void
  setActiveKey: (key: string | null) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      immer((set) => ({
        isOpen: true,
        isCollapsed: false,
        activeKey: null,

        toggle: () =>
          set((s) => {
            s.isOpen = !s.isOpen
          }),

        setOpen: (open) =>
          set((s) => {
            s.isOpen = open
          }),

        setCollapsed: (collapsed) =>
          set((s) => {
            s.isCollapsed = collapsed
          }),

        setActiveKey: (key) =>
          set((s) => {
            s.activeKey = key
          }),
      })),
      {
        name: 'sidebar-store',
        partialize: (state) => ({ isCollapsed: state.isCollapsed }),
      },
    ),
    { name: 'SidebarStore' },
  ),
)
