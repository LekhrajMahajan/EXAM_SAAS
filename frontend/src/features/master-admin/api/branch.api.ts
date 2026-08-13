import api from '@/services/api';
import type { PaginatedResponse, PaginationParams } from '@/types';

export interface Branch {
  _id: string;
  companyId: string;
  branchCode: string;
  branchName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  managerName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface BranchSearchParams extends PaginationParams {
  companyId?: string;
  status?: string;
  search?: string;
}

const BASE_PATH = '/branches';

export const branchApi = {
  getBranches: async (params?: BranchSearchParams): Promise<PaginatedResponse<Branch>> => {
    const { data } = await api.get<any>(BASE_PATH, { params });
    
    // Transform backend { data: { data: [], total... } } to frontend PaginatedResponse
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
          hasPrevPage: data.data.page > 1
        }
      };
    }
    return data as PaginatedResponse<Branch>;
  },
};
