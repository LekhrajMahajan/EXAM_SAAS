import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AppApiError } from '@/core/api/types/error.types';
import type { StandardQueryParams } from '@/core/api/types/request.types';

export type CustomQueryOptions<TData = any, TError = AppApiError> = Omit<
  UseQueryOptions<TData, TError>, 
  'queryKey' | 'queryFn'
>;

export type CustomMutationOptions<TData = any, TError = AppApiError, TVariables = void, TContext = unknown> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>, 
  'mutationFn'
>;

export interface EntityQueryParams extends StandardQueryParams {
  entityId?: string | number;
}
