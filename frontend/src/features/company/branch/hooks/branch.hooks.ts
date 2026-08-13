import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchApi } from '../api/branch.api';
import type { BranchQueryParams } from '../types/branch.types';
import type { BranchFormData } from '../schemas/branch.schema';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  list: (filters: string) => [...branchKeys.lists(), { filters }] as const,
  details: () => [...branchKeys.all, 'detail'] as const,
  detail: (id: string) => [...branchKeys.details(), id] as const,
  pendingVerifications: () => [...branchKeys.all, 'pending-verifications'] as const,
};

export const useBranches = (params?: BranchQueryParams) => {
  return useQuery({
    queryKey: branchKeys.list(JSON.stringify(params)),
    queryFn: () => branchApi.getAll(params),
  });
};

export const useBranch = (id: string) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchApi.getById(id),
    enabled: !!id,
  });
};

export const usePendingVerifications = () => {
  return useQuery({
    queryKey: branchKeys.pendingVerifications(),
    queryFn: () => branchApi.getPendingVerifications(),
  });
};

export const useVerifyBranchSetup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: "ACTIVE" | "REJECTED"; remarks?: string } }) =>
      branchApi.verifyBranchSetup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: branchKeys.pendingVerifications() });
      toast({ title: 'Success', description: 'Branch verification decision recorded successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to process branch verification';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useSaveOnboardingStep = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ step, data }: { step: number; data: unknown }) =>
      branchApi.saveOnboardingStep(id, step, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.detail(id) });
      toast({ title: 'Step Saved', description: `Step ${variables.step} data recorded successfully`, variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to save onboarding step';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BranchFormData) => branchApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      toast({ title: 'Success', description: 'Branch created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to create branch';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });
};

export const useUpdateBranch = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BranchFormData>) => branchApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: branchKeys.detail(id) });
      toast({ title: 'Success', description: 'Branch updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to update branch';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });
};

export const useUpdateBranchStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" }) => 
      branchApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      toast({ title: 'Success', description: 'Branch status updated', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to update branch status';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => branchApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      toast({ title: 'Success', description: 'Branch deleted successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to delete branch';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });
};

