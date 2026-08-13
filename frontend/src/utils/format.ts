// src/utils/format.ts
// Formatting utilities for dates, numbers, and strings.

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options,
  }).format(d)
}

export const formatDateTime = (date: string | Date): string =>
  formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export const formatScore = (score: number, total: number): string =>
  `${score}/${total} (${Math.round((score / total) * 100)}%)`

export const truncate = (str: string, length = 50): string =>
  str.length > length ? `${str.slice(0, length)}...` : str

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const toTitleCase = (str: string): string =>
  str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
