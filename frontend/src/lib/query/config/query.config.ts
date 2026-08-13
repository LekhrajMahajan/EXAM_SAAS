import type { AxiosError } from 'axios';
import type { AppApiError } from '@/core/api/types/error.types';

export const shouldRetry = (failureCount: number, error: unknown, maxRetries: number = 3): boolean => {
  const apiError = error as AppApiError;
  const axiosError = error as AxiosError<unknown>;
  const status = apiError?.status ?? axiosError?.response?.status;
  
  // Never retry on 4xx client errors (401 Unauthorized, 403 Forbidden, 404 Not Found, etc.)
  if (status && status >= 400 && status < 500) {
    return false;
  }
  return failureCount < maxRetries;
};

export const queryConfig = {
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Garbage collect unused data after 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Do not retry 4xx errors; retry other errors up to 3 times
      retry: (failureCount: number, error: unknown) => shouldRetry(failureCount, error, 3),
      
      // Delay between retries (exponential backoff)
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch when window regains focus (good for dashboards)
      refetchOnWindowFocus: true,
      
      // Refetch when reconnecting to network
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations 1 time by default
      retry: 1,
    }
  }
};
