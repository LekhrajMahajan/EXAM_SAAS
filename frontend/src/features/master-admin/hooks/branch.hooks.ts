import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchApi } from '../api/branch.api';
import type { BranchSearchParams, Branch } from '../api/branch.api';
import type { ApiError } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { AxiosError } from 'axios';

const QUERY_KEYS = {
  all: ['branches'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: BranchSearchParams) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

const handleError = (error: unknown, fallbackMessage: string, toast: ReturnType<typeof useToast>['toast']) => {
  const axiosError = error as AxiosError<ApiError>;
  const message = axiosError.response?.data?.message || fallbackMessage;
  toast({ title: 'Error', description: message, variant: 'destructive' });
};

export const useBranches = (params: BranchSearchParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => branchApi.getBranches(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useBranch = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => branchApi.getBranchById(id),
    enabled: !!id,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<Branch>) => branchApi.createBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      toast({ title: 'Success', description: 'Branch created successfully.' });
    },
    onError: (error) => handleError(error, 'Failed to create branch.', toast),
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Branch> }) =>
      branchApi.updateBranch(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      toast({ title: 'Success', description: 'Branch updated successfully.' });
    },
    onError: (error) => handleError(error, 'Failed to update branch.', toast),
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      toast({ title: 'Success', description: 'Branch deleted successfully.' });
    },
    onError: (error) => handleError(error, 'Failed to delete branch.', toast),
  });
};
