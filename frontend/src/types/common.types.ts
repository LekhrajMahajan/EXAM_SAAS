// src/types/common.types.ts
// Shared utility types used across the application.

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

export type ID = string

export type Status = 'idle' | 'loading' | 'success' | 'error'

export type Theme = 'light' | 'dark' | 'system'

export type UserRole = 'super_admin' | 'admin' | 'examiner' | 'candidate'

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export interface BaseEntity {
  id: ID
  createdAt: string
  updatedAt: string
}

export type PropsWithClassName<T = object> = T & {
  className?: string
}

export type PropsWithChildren<T = object> = T & {
  children: React.ReactNode
}
