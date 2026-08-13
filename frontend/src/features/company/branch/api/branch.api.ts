import { apiClient } from '@/core/api/http/axios-client';
import type { Branch, BranchListResponse, BranchQueryParams } from '../types/branch.types';
import type { BranchFormData } from '../schemas/branch.schema';

export const branchApi = {
  getAll: async (params?: BranchQueryParams) => {
    const response = await apiClient.get<BranchListResponse>('/branches', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Branch }>(`/branches/${id}`);
    return response.data;
  },

  create: async (data: BranchFormData) => {
    const response = await apiClient.post<{ data: Branch }>('/branches', data);
    return response.data;
  },

  update: async (id: string, data: Partial<BranchFormData>) => {
    const response = await apiClient.patch<{ data: Branch }>(`/branches/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: "ACTIVE" | "INACTIVE") => {
    const response = await apiClient.patch<{ data: Branch }>(`/branches/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ data: null }>(`/branches/${id}`);
    return response.data;
  },

  getPendingVerifications: async () => {
    const response = await apiClient.get<{ success: boolean; data: Branch[] }>('/branches/onboarding/pending-verifications');
    return response.data;
  },

  verifyBranchSetup: async (id: string, payload: { status: "ACTIVE" | "REJECTED"; remarks?: string }) => {
    const response = await apiClient.post<{ success: boolean; data: Branch }>(`/branches/${id}/onboarding/verify`, payload);
    return response.data;
  },

  saveOnboardingStep: async (id: string, step: number, data: unknown) => {
    const response = await apiClient.put<{ success: boolean; data: Branch; readinessScore?: number }>(`/branches/${id}/onboarding/step-${step}`, data);
    return response.data;
  },
};

