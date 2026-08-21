import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types';

const BASE_PATH = '/branches';

export interface BranchSearchParams {
  page?: number;
  limit?: number;
  companyId?: string;
  search?: string;
  status?: string;
}

export interface Branch {
  _id: string;
  branchName: string;
  branchCode?: string;
  companyId: string;
  status?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const branchApi = {
  getBranches: async (params?: BranchSearchParams): Promise<PaginatedResponse<Branch>> => {
    const { data } = await api.get<any>(BASE_PATH, { params });
    if (data.data && data.data.data) {
      return {
        success: data.success,
        data: data.data.data,
        pagination: {
          page: data.data.page,
          limit: data.data.limit,
          total: data.data.total,
          totalPages: data.data.totalPages,
          hasNextPage: data.data.page < data.data.totalPages,
          hasPrevPage: data.data.page > 1,
        },
      };
    }
    return data as PaginatedResponse<Branch>;
  },
};

const QUERY_KEYS = {
  all: ['branches'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: BranchSearchParams) => [...QUERY_KEYS.lists(), params] as const,
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
