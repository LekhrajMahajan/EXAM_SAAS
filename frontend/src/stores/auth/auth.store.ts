import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '../persist/config';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      status: 'idle',
      
      login: (tokens) => set({
        isAuthenticated: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        status: 'authenticated'
      }),
      
      logout: () => set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        status: 'unauthenticated'
      }),
    }),
    createPersistConfig('auth')
  )
);
