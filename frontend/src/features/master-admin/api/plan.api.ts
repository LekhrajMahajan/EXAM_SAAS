import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types';
import type { Plan, PlanFilters } from '../types/plan.types';
import type { PlanFormValues } from '../schemas/plan.schema';

const BASE_PATH = '/plans';

export const planApi = {
  getPlans: async (params?: PlanFilters): Promise<PaginatedResponse<Plan>> => {
    const { data } = await api.get<any>(BASE_PATH, { params });
    return {
      success: data.success ?? true,
      data: data.data?.data || [],
      pagination: {
        total: data.data?.total || 0,
        page: data.data?.page || 1,
        limit: data.data?.limit || 10,
        totalPages: data.data?.totalPages || 0,
        hasNextPage: data.data?.hasNextPage || false,
        hasPrevPage: data.data?.hasPrevPage || false,
      }
    };
  },

  getPlanById: async (id: string): Promise<Plan> => {
    const { data } = await api.get<ApiResponse<Plan>>(`${BASE_PATH}/${id}`);
    return data.data!;
  },

  createPlan: async (payload: PlanFormValues): Promise<Plan> => {
    const { data } = await api.post<ApiResponse<Plan>>(BASE_PATH, payload);
    return data.data!;
  },

  updatePlan: async (id: string, payload: Partial<PlanFormValues>): Promise<Plan> => {
    const { data } = await api.put<ApiResponse<Plan>>(`${BASE_PATH}/${id}`, payload);
    return data.data!;
  },

  clonePlan: async (id: string): Promise<Plan> => {
    const { data } = await api.post<ApiResponse<Plan>>(`${BASE_PATH}/${id}/clone`);
    return data.data!;
  },

  archivePlan: async (id: string): Promise<Plan> => {
    const { data } = await api.post<ApiResponse<Plan>>(`${BASE_PATH}/${id}/archive`);
    return data.data!;
  },

  togglePlanStatus: async (id: string, status: string): Promise<Plan> => {
    const { data } = await api.post<ApiResponse<Plan>>(`${BASE_PATH}/${id}/status`, { status });
    return data.data!;
  },

  deletePlan: async (id: string): Promise<void> => {
    await api.delete(`${BASE_PATH}/${id}`);
  },
};
