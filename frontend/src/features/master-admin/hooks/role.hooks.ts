import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '../api/role.api';
import type { RoleSearchParams, CreateRolePayload, UpdateRolePayload } from '../api/role.api';
import type { ApiError } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { AxiosError } from 'axios';

const QUERY_KEYS = {
  all: ['roles'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: RoleSearchParams) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  statistics: () => [...QUERY_KEYS.all, 'statistics'] as const,
};

const handleError = (error: unknown, fallbackMessage: string, toast: ReturnType<typeof useToast>['toast']) => {
  const axiosError = error as AxiosError<ApiError>;
  const message = axiosError.response?.data?.message || fallbackMessage;
  toast({ title: 'Error', description: message, variant: 'destructive' });
};

export const useRoles = (params: RoleSearchParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => roleApi.getRoles(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: !!id,
  });
};

export const useRoleStatistics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(),
    queryFn: () => roleApi.getRoleStatistics(),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => roleApi.createRole(payload),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Role created successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to create role', toast),
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      roleApi.updateRole(id, payload),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Role updated successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to update role', toast),
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => roleApi.deleteRole(id),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Role deleted successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to delete role', toast),
  });
};

export const useUpdateRoleStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      roleApi.updateRoleStatus(id, status),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Role status updated' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to update role status', toast),
  });
};

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      roleApi.assignPermissions(id, permissions),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Permissions assigned successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['permissions', 'matrix'] });
    },
    onError: (error) => handleError(error, 'Failed to assign permissions', toast),
  });
};

export const useCloneRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateRolePayload> }) =>
      roleApi.cloneRole(id, payload),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Role cloned successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to clone role', toast),
  });
};
