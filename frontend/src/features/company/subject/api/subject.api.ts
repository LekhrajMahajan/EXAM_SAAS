import { apiClient } from '@/core/api/http/axios-client';
import type { Subject } from '../types';

export interface SubjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SubjectListResponse {
  success: boolean;
  message: string;
  data: {
    items: Subject[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | Subject[];
}

export const subjectApi = {
  getAll: async (params?: SubjectListParams) => {
    const response = await apiClient.get<SubjectListResponse>('/subjects', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Subject }>(`/subjects/${id}`);
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Subject }>('/subjects', data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await apiClient.patch<{ success: boolean; data: Subject }>(`/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(`/subjects/${id}`);
    return response.data;
  },

  getChapters: async (subjectId: string) => {
    const response = await apiClient.get('/chapters', { params: { subjectId } });
    return response.data;
  },

  getTopics: async (chapterId: string) => {
    const response = await apiClient.get('/topics', { params: { chapterId } });
    return response.data;
  },
};
