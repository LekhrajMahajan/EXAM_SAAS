// src/providers/ThemeProvider.tsx
// Theme provider — applies dark/light class to document root.
import { useEffect } from 'react'
import { useAppStore } from '@/store'

import { ThemeContext } from './theme-context'

// ─── Provider ────────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
