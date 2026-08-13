// src/utils/storage.ts
// Type-safe wrappers around localStorage / sessionStorage.

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn('localStorage.setItem failed:', err)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}

export const sessionStorage_ = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn('sessionStorage.setItem failed:', err)
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key)
  },
}
