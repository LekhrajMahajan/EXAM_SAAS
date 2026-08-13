import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/company.api';
import type { CompanyFormValues, CompanySearchParams } from '../schemas/company.schema';
import type { ApiError } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { AxiosError } from 'axios';

const QUERY_KEYS = {
  all: ['companies'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: CompanySearchParams) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  statistics: () => [...QUERY_KEYS.all, 'statistics'] as const,
};

// Error handling helper
const handleError = (error: unknown, fallbackMessage: string, toast: ReturnType<typeof useToast>['toast']) => {
  const axiosError = error as AxiosError<ApiError>;
  const message = axiosError.response?.data?.message || fallbackMessage;
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

export const useCompanies = (params: CompanySearchParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => companyApi.getCompanies(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCompanyStatistics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(),
    queryFn: () => companyApi.getCompanyStatistics(),
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => companyApi.getCompanyById(id),
    enabled: !!id,
  });
};



export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CompanyFormValues) => companyApi.createCompany(payload),
    onSuccess: (response) => {
      // Don't toast here if we need to proceed to payment, handled in page
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to create company', toast),
  });
};

export const useRegisterCompany = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CompanyFormValues) => companyApi.registerCompany(payload),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || 'Company registered successfully. Awaiting approval.',
      });
    },
    onError: (error) => handleError(error, 'Failed to register company', toast),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, paymentData }: { id: string, paymentData: any }) => companyApi.verifyPayment(id, paymentData),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || 'Payment verified successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to verify payment', toast),
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CompanyFormValues> }) => 
      companyApi.updateCompany(id, payload),
    onSuccess: (response, variables) => {
      toast({
        title: "Success",
        description: response.message || 'Company updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to update company', toast),
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { subscriptionPlan?: string; subscriptionStartDate?: string; subscriptionEndDate?: string } }) =>
      companyApi.updateSubscription(id, payload),
    onSuccess: (response, variables) => {
      toast({
        title: "Success",
        description: response.message || 'Subscription updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to update subscription', toast),
  });
};


export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => companyApi.deleteCompany(id),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || 'Company deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to delete company', toast),
  });
};

export const useRestoreCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => companyApi.restoreCompany(id),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || 'Company restored successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to restore company', toast),
  });
};

export const useUpdateCompanyStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => 
      companyApi.updateCompanyStatus(id, status),
    onSuccess: (response, variables) => {
      toast({
        title: "Success",
        description: response.message || 'Company status updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
    },
    onError: (error) => handleError(error, 'Failed to update company status', toast),
  });
};

export const useApprovalStatistics = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'approval-statistics'],
    queryFn: () => companyApi.getApprovalStatistics(),
  });
};

export const useAssignReviewer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reviewerId }: { id: string; reviewerId: string }) => 
      companyApi.assignReviewer(id, reviewerId),
    onSuccess: (response, variables) => {
      toast({
        title: "Success",
        description: response.message || 'Reviewer assigned successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
    onError: (error) => handleError(error, 'Failed to assign reviewer', toast),
  });
};

export const useApproveCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => companyApi.approveCompany(id),
    onSuccess: (response, id) => {
      toast({
        title: "Success",
        description: response.message || 'Company approved successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'approval-statistics'] });
    },
    onError: (error) => handleError(error, 'Failed to approve company', toast),
  });
};

export const useRejectCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason, remarks }: { id: string; reason: string; remarks?: string }) => 
      companyApi.rejectCompany(id, reason, remarks),
    onSuccess: (response, variables) => {
      toast({
        title: "Success",
        description: response.message || 'Company rejected successfully',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'approval-statistics'] });
    },
    onError: (error) => handleError(error, 'Failed to reject company', toast),
  });
};
