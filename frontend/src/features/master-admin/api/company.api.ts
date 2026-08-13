import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types';
import type { Company, CompanyStatistics, ApprovalStatistics } from '../types/company.types';
import type { CompanyFormValues, CompanySearchParams } from '../schemas/company.schema';

const BASE_PATH = '/companies';

export const companyApi = {
  getCompanies: async (params?: CompanySearchParams): Promise<PaginatedResponse<Company>> => {
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
    return data as PaginatedResponse<Company>;
  },

  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    const { data } = await api.get<ApiResponse<Company>>(`${BASE_PATH}/${id}`);
    return data;
  },

  createCompany: async (payload: CompanyFormValues): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>(BASE_PATH, payload);
    return data;
  },

  registerCompany: async (payload: CompanyFormValues): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>(`${BASE_PATH}/register`, payload);
    return data;
  },

  verifyPayment: async (id: string, paymentData: any): Promise<ApiResponse<Company>> => {
    const { data } = await api.post<ApiResponse<Company>>(`${BASE_PATH}/${id}/verify-payment`, paymentData);
    return data;
  },

  updateCompany: async (id: string, payload: Partial<CompanyFormValues>): Promise<ApiResponse<Company>> => {
    const { data } = await api.patch<ApiResponse<Company>>(`${BASE_PATH}/${id}`, payload);
    return data;
  },

  deleteCompany: async (id: string): Promise<ApiResponse<Company>> => {
    const { data } = await api.delete<ApiResponse<Company>>(`${BASE_PATH}/${id}`);
    return data;
  },

  restoreCompany: async (id: string): Promise<ApiResponse<Company>> => {
    const { data } = await api.patch<ApiResponse<Company>>(`${BASE_PATH}/${id}/restore`);
    return data;
  },

  updateCompanyStatus: async (id: string, status: boolean): Promise<ApiResponse<Company>> => {
    const { data } = await api.patch<ApiResponse<Company>>(`${BASE_PATH}/${id}/status`, { status });
    return data;
  },

  getCompanyStatistics: async (): Promise<ApiResponse<CompanyStatistics>> => {
    const { data } = await api.get<ApiResponse<CompanyStatistics>>(`${BASE_PATH}/statistics`);
    return data;
  },

  getApprovalStatistics: async (): Promise<ApiResponse<ApprovalStatistics>> => {
    const { data } = await api.get<ApiResponse<ApprovalStatistics>>(`${BASE_PATH}/approvals/statistics`);
    return data;
  },

  assignReviewer: async (id: string, reviewerId: string): Promise<ApiResponse<Company>> => {
    const { data } = await api.post<ApiResponse<Company>>(`${BASE_PATH}/${id}/assign-reviewer`, { reviewerId });
    return data;
  },

  approveCompany: async (id: string): Promise<ApiResponse<Company>> => {
    const { data } = await api.post<ApiResponse<Company>>(`${BASE_PATH}/${id}/approve`);
    return data;
  },

  rejectCompany: async (id: string, reason: string, remarks?: string): Promise<ApiResponse<Company>> => {
    const { data } = await api.post<ApiResponse<Company>>(`${BASE_PATH}/${id}/reject`, { reason, remarks });
    return data;
  },

  updateSubscription: async (
    id: string,
    payload: { subscriptionPlan?: string; subscriptionStartDate?: string; subscriptionEndDate?: string }
  ): Promise<ApiResponse<Company>> => {
    const { data } = await api.patch<ApiResponse<Company>>(`${BASE_PATH}/${id}/subscription`, payload);
    return data;
  },
};

