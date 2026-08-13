import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { centerApi } from '../api/center.api';
import type { CenterQueryParams } from '../types/center.types';
import type { CenterFormValues } from '../schemas/center.schema';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export const centerKeys = {
  all: ['centers'] as const,
  lists: () => [...centerKeys.all, 'list'] as const,
  list: (filters: string) => [...centerKeys.lists(), { filters }] as const,
  details: () => [...centerKeys.all, 'detail'] as const,
  detail: (id: string) => [...centerKeys.details(), id] as const,
  pendingVerifications: () => [...centerKeys.all, 'pending-verifications'] as const,
  onboardingStatus: () => [...centerKeys.all, 'onboarding-status'] as const,
};

export const useCenters = (params?: CenterQueryParams) => {
  return useQuery({
    queryKey: centerKeys.list(JSON.stringify(params)),
    queryFn: () => centerApi.getAll(params),
  });
};

export const useCenter = (id: string) => {
  return useQuery({
    queryKey: centerKeys.detail(id),
    queryFn: () => centerApi.getById(id),
    enabled: !!id,
  });
};

export const usePendingVerifications = () => {
  return useQuery({
    queryKey: centerKeys.pendingVerifications(),
    queryFn: () => centerApi.getPendingVerifications(),
  });
};

export const useOnboardingStatus = () => {
  return useQuery({
    queryKey: centerKeys.onboardingStatus(),
    queryFn: () => centerApi.getOnboardingStatus(),
  });
};

export const useSaveOnboardingStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ endpoint, data }: { endpoint: string; data: unknown }) =>
      centerApi.saveOnboardingStep(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.onboardingStatus() });
      toast({ title: 'Step Saved', description: 'Onboarding step data recorded successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to save onboarding step';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useSubmitOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => centerApi.submitOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.onboardingStatus() });
      toast({ title: 'Setup Submitted', description: 'Your Center Setup has been submitted for verification', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to submit onboarding setup';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useVerifyCenterSetup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: 'ACTIVE' | 'REJECTED'; remarks?: string } }) =>
      centerApi.verifyCenterSetup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: centerKeys.pendingVerifications() });
      toast({ title: 'Success', description: 'Center setup verification completed successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to complete center verification';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useApproveDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, centerId }: { docId: string; centerId?: string }) =>
      centerApi.approveDocument(docId, centerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.pendingVerifications() });
      queryClient.invalidateQueries({ queryKey: centerKeys.onboardingStatus() });
      toast({ title: 'Document Approved', description: 'Document verification approved', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to approve document';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useRejectDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, payload }: { docId: string; payload: { rejectionReason: string; correctionNotes?: string; centerId?: string } }) =>
      centerApi.rejectDocument(docId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.pendingVerifications() });
      queryClient.invalidateQueries({ queryKey: centerKeys.onboardingStatus() });
      toast({ title: 'Document Rejected', description: 'Document feedback sent to Center Manager', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to reject document';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useCreateCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CenterFormValues) => centerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
      toast({ title: 'Success', description: 'Center created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to create center';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useUpdateCenter = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CenterFormValues>) => centerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: centerKeys.detail(id) });
      toast({ title: 'Success', description: 'Center profile updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to update center';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useDeleteCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => centerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: centerKeys.lists() });
      toast({ title: 'Success', description: 'Center deleted successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to delete center';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};
