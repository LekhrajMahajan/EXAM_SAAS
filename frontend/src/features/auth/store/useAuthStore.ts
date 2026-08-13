import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState as BaseAuthState } from '../types';

interface AuthState extends BaseAuthState {
  permissions: string[];
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User, permissions: string[]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],

      setTokens: (token, refreshToken) =>
        set({ token, refreshToken, isAuthenticated: true }),

      setUser: (user, permissions) => set({ user, permissions }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          permissions: [],
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        refreshToken: state.refreshToken, 
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);
