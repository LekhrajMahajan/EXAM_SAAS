import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi, type StaffListParams } from '../api/staff.api';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export const staffKeys = {
  all: ['employees'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: string) => [...staffKeys.lists(), { filters }] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  stats: (companyId?: string) => [...staffKeys.all, 'stats', companyId] as const,
};

export const useStaffList = (params?: StaffListParams) => {
  return useQuery({
    queryKey: staffKeys.list(JSON.stringify(params || {})),
    queryFn: () => staffApi.getAll(params),
  });
};

export const useStaffDetail = (id: string) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getById(id),
    enabled: !!id,
  });
};

export const useStaffStatistics = (companyId?: string) => {
  return useQuery({
    queryKey: staffKeys.stats(companyId),
    queryFn: () => staffApi.getStatistics(companyId),
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => staffApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['employees', 'stats'] });
      toast({ title: 'Success', description: 'Employee account created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to create employee';
      toast({ title: 'Error', description: String(msg || 'Failed to create employee'), variant: 'destructive' });
    },
  });
};

export const useInviteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => staffApi.invite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      toast({ title: 'Success', description: 'Employee invited successfully and onboarding credentials sent', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to invite employee';
      toast({ title: 'Error', description: String(msg || 'Failed to invite employee'), variant: 'destructive' });
    },
  });
};

export const useUpdateStaff = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => staffApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
      toast({ title: 'Success', description: 'Employee record updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to update employee';
      toast({ title: 'Error', description: String(msg || 'Failed to update employee'), variant: 'destructive' });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      toast({ title: 'Deleted', description: 'Employee record deleted successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to delete employee';
      toast({ title: 'Error', description: String(msg || 'Failed to delete employee'), variant: 'destructive' });
    },
  });
};

export const useApproveStaffVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.approveVerification(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
      toast({ title: 'Verification Approved', description: 'Operational dashboard unlocked for employee', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to approve verification';
      toast({ title: 'Error', description: String(msg || 'Failed to approve verification'), variant: 'destructive' });
    },
  });
};

export const useRejectStaffVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason, correctionNotes }: { id: string; reason: string; correctionNotes?: string }) =>
      staffApi.rejectVerification(id, reason, correctionNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) });
      toast({ title: 'Verification Rejected', description: 'Correction notes sent to employee', variant: 'destructive' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to reject verification';
      toast({ title: 'Error', description: String(msg || 'Failed to reject verification'), variant: 'destructive' });
    },
  });
};
