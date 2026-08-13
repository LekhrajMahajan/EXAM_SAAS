import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';
import type { EmployeeSearchParams, CreateEmployeePayload, UpdateEmployeePayload } from '../api/employee.api';
import type { ApiError } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { AxiosError } from 'axios';

const QUERY_KEYS = {
  all: ['employees'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: EmployeeSearchParams) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  statistics: () => [...QUERY_KEYS.all, 'statistics'] as const,
  loginHistory: (id: string, params: any) => [...QUERY_KEYS.detail(id), 'login-history', params] as const,
  activity: (id: string, params: any) => [...QUERY_KEYS.detail(id), 'activity', params] as const,
};

const handleError = (error: unknown, fallbackMessage: string, toast: ReturnType<typeof useToast>['toast']) => {
  const axiosError = error as AxiosError<ApiError>;
  const message = axiosError.response?.data?.message || fallbackMessage;
  toast({ title: 'Error', description: message, variant: 'destructive' });
};

export const useEmployees = (params: EmployeeSearchParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => employeeApi.getEmployees(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });
};

export const useEmployeeStatistics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(),
    queryFn: () => employeeApi.getEmployeeStatistics(),
  });
};

export const useEmployeeLoginHistory = (id: string, params: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.loginHistory(id, params),
    queryFn: () => employeeApi.getEmployeeLoginHistory(id, params),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};

export const useEmployeeActivity = (id: string, params: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.activity(id, params),
    queryFn: () => employeeApi.getEmployeeActivity(id, params),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeApi.createEmployee(payload),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Employee created successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to create employee', toast),
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      employeeApi.updateEmployee(id, payload),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Employee updated successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to update employee', toast),
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: (response) => {
      toast({ title: 'Success', description: response.message || 'Employee deleted successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to delete employee', toast),
  });
};

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      employeeApi.updateEmployeeStatus(id, status),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Employee status updated' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to update employee status', toast),
  });
};

export const useAssignEmployeeRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      employeeApi.assignEmployeeRole(id, role),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Role assigned successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to assign role', toast),
  });
};

export const useResetEmployeePassword = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      employeeApi.resetEmployeePassword(id, newPassword),
    onSuccess: (response, variables) => {
      toast({ title: 'Success', description: response.message || 'Password reset successfully' });
      // Invalidate if we want to refresh anything, mostly detail is enough if it holds password info
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to reset password', toast),
  });
};

export const useRestoreEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => employeeApi.restoreEmployee(id),
    onSuccess: (response, id) => {
      toast({ title: 'Success', description: response.message || 'Employee restored successfully' });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to restore employee', toast),
  });
};
