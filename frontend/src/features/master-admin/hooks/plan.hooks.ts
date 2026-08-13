import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planApi } from '../api/plan.api';
import type { PlanFilters } from '../types/plan.types';
import type { PlanFormValues } from '../schemas/plan.schema';
import { toast } from 'react-hot-toast';

export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters: PlanFilters) => [...planKeys.lists(), filters] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
};

export function usePlans(filters: PlanFilters = {}) {
  return useQuery({
    queryKey: planKeys.list(filters),
    queryFn: () => planApi.getPlans(filters),
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => planApi.getPlanById(id),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlanFormValues) => planApi.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      toast.success('Plan created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create plan');
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlanFormValues> }) => planApi.updatePlan(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables.id) });
      toast.success('Plan updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update plan');
    },
  });
}

export function useClonePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => planApi.clonePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      toast.success('Plan cloned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clone plan');
    },
  });
}

export function useTogglePlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => planApi.togglePlanStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables.id) });
      toast.success(`Plan marked as ${variables.status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update plan status');
    },
  });
}

export function useArchivePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => planApi.archivePlan(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables) });
      toast.success('Plan archived successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to archive plan');
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => planApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      toast.success('Plan deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete plan');
    },
  });
}
