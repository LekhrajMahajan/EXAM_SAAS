import { apiClient } from '@/core/api/http/axios-client';

export interface SubjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface Subject {
  _id: string;
  subjectCode: string;
  subjectName: string;
  subjectShortName: string;
  description?: string;
  language?: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarks?: number;
  questionCount?: number;
  status: string;
  createdAt: string;
}

export interface SubjectListResponse {
  success: boolean;
  message: string;
  data: {
    subjects: Subject[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
};
