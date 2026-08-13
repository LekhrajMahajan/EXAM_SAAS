// src/hooks/useMediaQuery.ts
// Reactive media query hook using useSyncExternalStore — React's built-in API
// for subscribing to external state without triggering cascading renders.
import { useSyncExternalStore, useCallback } from 'react'

export function useMediaQuery(query: string): boolean {
  // subscribe receives the React-managed callback and returns an unsubscribe fn.
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    [query],
  )

  // getSnapshot is called during render to read the current value.
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  // getServerSnapshot provides a safe SSR fallback.
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// Convenience hooks
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const usePrefersDark = () => useMediaQuery('(prefers-color-scheme: dark)')

