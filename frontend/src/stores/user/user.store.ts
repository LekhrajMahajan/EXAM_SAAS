import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '../persist/config';
import type { UserProfile } from '../types';

interface UserState {
  profile: UserProfile | null;
  preferences: Record<string, any>;
  
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (prefs: Record<string, any>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      preferences: {},
      
      setProfile: (profile) => set({ profile }),
      updatePreferences: (prefs) => set((state) => ({ 
        preferences: { ...state.preferences, ...prefs } 
      })),
      clearUser: () => set({ profile: null, preferences: {} }),
    }),
    createPersistConfig('user')
  )
);
