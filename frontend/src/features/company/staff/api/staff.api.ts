import { apiClient } from '@/core/api/http/axios-client';
import type { Staff, StaffDetails } from '../types/staff.types';

export interface StaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  department?: string;

  center?: string;
  status?: string;
  verificationStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  excludeRole?: string;
}

export interface StaffListResponse {
  success: boolean;
  message: string;
  data: {
    data: Staff[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | Staff[];
}

export const staffApi = {
  getAll: async (params?: StaffListParams) => {
    const response = await apiClient.get<StaffListResponse>('/employees', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: StaffDetails }>(`/employees/${id}`);
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Staff }>('/employees', data);
    return response.data;
  },

  invite: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Staff }>('/employees/invite', data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await apiClient.patch<{ success: boolean; data: Staff }>(`/employees/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Staff }>(`/employees/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(`/employees/${id}`);
    return response.data;
  },

  getStatistics: async (companyId?: string) => {
    const response = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>('/employees/statistics', {
      params: { companyId }
    });
    return response.data;
  },

  exportStaff: async (params?: StaffListParams, format: 'json' | 'csv' | 'xlsx' = 'xlsx') => {
    const response = await apiClient.get('/employees/export', {
      params: { ...params, format },
      responseType: format === 'json' ? 'json' : 'blob',
    });
    return response.data;
  },

  uploadDocuments: async (id: string, documents: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Staff }>(`/employees/${id}/upload-documents`, { documents });
    return response.data;
  },

  faceEnrollment: async (id: string, biometricData: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Staff }>(`/employees/${id}/face-enrollment`, biometricData);
    return response.data;
  },

  approveVerification: async (id: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Staff }>(`/employees/${id}/approve-verification`, {});
    return response.data;
  },

  rejectVerification: async (id: string, reason: string, correctionNotes?: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Staff }>(`/employees/${id}/reject-verification`, { reason, correctionNotes });
    return response.data;
  },

  bulkOperation: async (action: string, employeeIds: string[]) => {
    const response = await apiClient.post<{ success: boolean; data: unknown }>('/employees/bulk-action', { action, employeeIds });
    return response.data;
  },
};
