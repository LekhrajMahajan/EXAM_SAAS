import { apiClient } from '@/core/api/http/axios-client';
import type { Question } from '../types';

export interface QuestionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  topic?: string;
  chapter?: string;
  difficulty?: string;
  status?: string;
  questionType?: string;
}

export interface QuestionListResponse {
  success: boolean;
  data: {
    questions?: Question[];
    items?: Question[];
    total?: number;
    page?: number;
    limit?: number;
  } | Question[];
}

export const questionApi = {
  getAll: async (params?: QuestionQueryParams) => {
    const response = await apiClient.get<QuestionListResponse>('/questions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Question }>(`/questions/${id}`);
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Question }>('/questions', data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await apiClient.patch<{ success: boolean; data: Question }>(`/questions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(`/questions/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Question }>(`/questions/${id}/status`, { status });
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>('/questions/statistics');
    return response.data;
  },
};
