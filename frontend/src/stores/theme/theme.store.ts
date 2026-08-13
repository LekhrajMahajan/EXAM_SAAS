import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPersistConfig } from '../persist/config';
import type { ThemeConfig } from '../types';

interface ThemeState extends ThemeConfig {
  setThemeMode: (mode: ThemeConfig['mode']) => void;
  setPrimaryColor: (color: string) => void;
  setDensity: (density: ThemeConfig['density']) => void;
  setFontSize: (size: ThemeConfig['fontSize']) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      primaryColor: '#4f46e5', // Indigo 600
      density: 'standard',
      fontSize: 'medium',
      
      setThemeMode: (mode) => set({ mode }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setDensity: (density) => set({ density }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    createPersistConfig('theme')
  )
);
