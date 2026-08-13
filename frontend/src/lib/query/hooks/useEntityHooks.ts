import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BaseApiService } from '@/core/api/services/base.service';
import type { CustomQueryOptions, CustomMutationOptions } from '../types/query.types';
import type { StandardQueryParams, BulkOperationPayload } from '@/core/api/types/request.types';

// Generic List Hook
export function useEntityList<T>(
  queryKey: any[], 
  service: BaseApiService<T>, 
  params?: StandardQueryParams,
  options?: CustomQueryOptions
) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => service.list(params),
    ...options
  });
}

// Generic Detail Hook
export function useEntity<T>(
  queryKey: any[], 
  service: BaseApiService<T>, 
  id: string | number,
  options?: CustomQueryOptions
) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => service.getById(id),
    enabled: !!id,
    ...options
  });
}

// Generic Create Hook
export function useCreateEntity<T>(
  invalidationKey: any[], 
  service: BaseApiService<T>,
  options?: CustomMutationOptions<any, any, Partial<T>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<T>) => service.create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invalidationKey });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    ...options
  });
}

// Generic Update Hook
export function useUpdateEntity<T>(
  invalidationKey: any[], 
  service: BaseApiService<T>,
  options?: CustomMutationOptions<any, any, { id: string | number, data: Partial<T> }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => service.update(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invalidationKey });
      queryClient.invalidateQueries({ queryKey: [...invalidationKey, variables.id] });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    ...options
  });
}

// Generic Delete Hook
export function useDeleteEntity<T>(
  invalidationKey: any[], 
  service: BaseApiService<T>,
  options?: CustomMutationOptions<any, any, string | number>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => service.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invalidationKey });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    ...options
  });
}

// Generic Approve Hook (Placeholder)
export function useApproveEntity<T>(
  invalidationKey: any[], 
  service: BaseApiService<T>,
  options?: CustomMutationOptions<any, any, { id: string | number, metadata?: any }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, metadata }) => service.approve(id, metadata),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invalidationKey });
      queryClient.invalidateQueries({ queryKey: [...invalidationKey, variables.id] });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    ...options
  });
}

// Generic Publish Hook (Placeholder)
export function usePublishEntity<T>(
  invalidationKey: any[], 
  service: BaseApiService<T>,
  options?: CustomMutationOptions<any, any, string | number>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => service.publish(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invalidationKey });
      queryClient.invalidateQueries({ queryKey: [...invalidationKey, variables] });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    ...options
  });
}

// Generic Bulk Action Hook (Placeholder)
export function useBulkAction<T>(
  invalidationKey: any[], 
  service: BaseApiService<T>,
  options?: CustomMutationOptions<any, any, BulkOperationPayload<string | number>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkOperationPayload<string | number>) => service.bulkOperation(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invalidationKey });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    ...options
  });
}
