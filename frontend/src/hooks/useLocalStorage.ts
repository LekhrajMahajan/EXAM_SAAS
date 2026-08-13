// src/hooks/useLocalStorage.ts
// Reactive localStorage hook.
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (err) {
        console.warn(`useLocalStorage: Failed to set key "${key}"`, err)
      }
    },
    [key, storedValue],
  )

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key)
    setStoredValue(initialValue)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}
