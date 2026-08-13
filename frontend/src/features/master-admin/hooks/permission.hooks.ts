import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionApi } from '../api/permission.api';
import type { PermissionSearchParams, CreatePermissionPayload, UpdatePermissionPayload } from '../api/permission.api';
import type { ApiError } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { AxiosError } from 'axios';

const QUERY_KEYS = {
  all: ['permissions'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: PermissionSearchParams) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  statistics: () => [...QUERY_KEYS.all, 'statistics'] as const,
  matrix: (companyId?: string) => [...QUERY_KEYS.all, 'matrix', companyId] as const,
};

const handleError = (error: unknown, fallbackMessage: string, toast: ReturnType<typeof useToast>['toast']) => {
  const axiosError = error as AxiosError<ApiError>;
  const message = axiosError.response?.data?.message || fallbackMessage;
  toast({ title: 'Error', description: message, variant: 'destructive' });
};

export const usePermissions = (params: PermissionSearchParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => permissionApi.getPermissions(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useSearchPermissions = (params: PermissionSearchParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.lists(), 'search', params],
    queryFn: () => permissionApi.searchPermissions(params),
    placeholderData: (previousData) => previousData,
  });
};

export const usePermissionsByGroup = (group: string, companyId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'group', group, companyId],
    queryFn: () => permissionApi.getPermissionsByGroup(group, companyId),
    enabled: !!group,
  });
};

export const usePermissionsByModule = (moduleName: string, companyId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'module', moduleName, companyId],
    queryFn: () => permissionApi.getPermissionsByModule(moduleName, companyId),
    enabled: !!moduleName,
  });
};

export const usePermission = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => permissionApi.getPermissionById(id),
    enabled: !!id,
  });
};

export const usePermissionStatistics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(),
    queryFn: () => permissionApi.getPermissionStatistics(),
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreatePermissionPayload) => permissionApi.createPermission(payload),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Permission created successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to create permission', toast),
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePermissionPayload }) =>
      permissionApi.updatePermission(id, payload),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Permission updated successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to update permission', toast),
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => permissionApi.deletePermission(id),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Permission deleted successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to delete permission', toast),
  });
};

export const useUpdatePermissionStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      permissionApi.updatePermissionStatus(id, status),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Permission status updated' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to update permission status', toast),
  });
};

export const usePermissionMatrix = (companyId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.matrix(companyId),
    queryFn: () => permissionApi.getPermissionMatrix(companyId),
  });
};
