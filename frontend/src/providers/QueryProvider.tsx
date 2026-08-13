// src/providers/QueryProvider.tsx
// TanStack Query provider with sensible defaults for enterprise use.
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

// ─── Default Query Client Config ─────────────────────────────────────────────

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 min
        gcTime: 1000 * 60 * 30, // 30 min
        retry: (failureCount, error) => {
          const axiosError = error as AxiosError<ApiError>
          const status = axiosError?.response?.status ?? (error as { status?: number })?.status
          // Don't retry on 4xx client errors
          if (status && status >= 400 && status < 500) return false
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  })

// ─── Provider ────────────────────────────────────────────────────────────────

interface QueryProviderProps {
  children: React.ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}

    </QueryClientProvider>
  )
}
