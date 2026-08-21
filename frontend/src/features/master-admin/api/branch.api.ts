import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types';

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
  createdAt?: string;
  updatedAt?: string;
}

export const branchApi = {
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

  getBranchById: async (id: string): Promise<ApiResponse<Branch>> => {
    const { data } = await api.get<ApiResponse<Branch>>(`${BASE_PATH}/${id}`);
    return data;
  },

  createBranch: async (payload: Partial<Branch>): Promise<ApiResponse<Branch>> => {
    const { data } = await api.post<ApiResponse<Branch>>(BASE_PATH, payload);
    return data;
  },

  updateBranch: async (id: string, payload: Partial<Branch>): Promise<ApiResponse<Branch>> => {
    const { data } = await api.put<ApiResponse<Branch>>(`${BASE_PATH}/${id}`, payload);
    return data;
  },

  deleteBranch: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`${BASE_PATH}/${id}`);
    return data;
  },
};
