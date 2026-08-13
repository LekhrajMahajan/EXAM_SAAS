import { apiClient } from '@/core/api/http/axios-client';
import type { Center, CenterListResponse, CenterQueryParams } from '../types/center.types';
import type { CenterFormValues } from '../schemas/center.schema';

export const centerApi = {
  getAll: async (params?: CenterQueryParams) => {
    const response = await apiClient.get<CenterListResponse>('/centers', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Center }>(`/centers/${id}`);
    return response.data;
  },

  create: async (data: CenterFormValues | unknown) => {
    const response = await apiClient.post<{ data: Center }>('/centers', data);
    return response.data;
  },

  sendCredentials: async (payload: { email?: string; temporaryPassword?: string; centerName?: string; managerName?: string }) => {
    const response = await apiClient.post<{ success: boolean }>('/centers/send-credentials', payload);
    return response.data;
  },

  update: async (id: string, data: Partial<CenterFormValues> | unknown) => {
    const response = await apiClient.patch<{ data: Center }>(`/centers/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: 'Active' | 'Inactive' | string) => {
    const response = await apiClient.patch<{ data: Center }>(`/centers/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ data: null }>(`/centers/${id}`);
    return response.data;
  },

  getPendingVerifications: async () => {
    const response = await apiClient.get<{ success: boolean; data: Center[] }>('/centers/pending-verifications');
    return response.data;
  },

  getOnboardingStatus: async (centerId?: string) => {
    const url = centerId ? `/centers/onboarding/status?centerId=${centerId}` : '/centers/onboarding/status';
    const response = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(url);
    return response.data;
  },

  saveOnboardingStep: async (endpoint: string, data: unknown) => {
    const response = await apiClient.put<{ success: boolean; data: Center; readinessScore?: number; complianceScore?: number }>(`/centers/onboarding/${endpoint}`, data);
    return response.data;
  },

  submitOnboarding: async () => {
    const response = await apiClient.post<{ success: boolean; data: Center }>('/centers/onboarding/submit', {});
    return response.data;
  },

  getCommercialAgreement: async (id?: string) => {
    const response = await apiClient.get<{ success: boolean; data: any }>(`/centers/commercial-agreement${id ? `?centerId=${id}` : ''}`);
    return response.data;
  },



  verifyCenterSetup: async (id: string, payload: { status: 'ACTIVE' | 'REJECTED' | string; remarks?: string }) => {
    const response = await apiClient.patch<{ success: boolean; data: Center }>(`/centers/${id}/verify`, payload);
    return response.data;
  },

  approveDocument: async (docId: string, centerId?: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Center }>(`/centers/documents/${docId}/approve${centerId ? `?centerId=${centerId}` : ''}`, {});
    return response.data;
  },

  rejectDocument: async (docId: string, payload: { rejectionReason: string; correctionNotes?: string; centerId?: string }) => {
    const { centerId, ...body } = payload;
    const response = await apiClient.patch<{ success: boolean; data: Center }>(`/centers/documents/${docId}/reject${centerId ? `?centerId=${centerId}` : ''}`, body);
    return response.data;
  },
};
