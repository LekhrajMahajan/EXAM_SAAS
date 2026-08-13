// src/store/auth.store.ts — authentication state slice
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Role } from '@/config/permissions'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: AuthUser | null) => void
  setToken: (token: string | null, refreshToken?: string | null) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,

        setUser: (user) =>
          set((s) => {
            s.user = user
            s.isAuthenticated = !!user
          }),

        setToken: (token, refreshToken = null) =>
          set((s) => {
            s.token = token
            s.refreshToken = refreshToken
          }),

        logout: () =>
          set((s) => {
            s.user = null
            s.token = null
            s.refreshToken = null
            s.isAuthenticated = false
          }),

        setLoading: (loading) =>
          set((s) => {
            s.isLoading = loading
          }),
      })),
      {
        name: 'auth-store',
        partialize: (state) => ({
          token: state.token,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
)
