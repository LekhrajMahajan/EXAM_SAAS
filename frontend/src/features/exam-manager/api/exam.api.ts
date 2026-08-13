import { apiClient } from '@/core/api/http/axios-client';

export interface ExamListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface Exam {
  _id: string;
  examCode: string;
  examTitle: string;
  examType?: string;
  examMode?: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarks?: number;
  language?: string;
  difficulty?: string;
  instructions?: string;
  examCategory?: string;
  subjects?: { name: string; questions: number }[];
  status: string;
  displayStatus?: string;
  approvalStatus: string;
  createdAt: string;
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: {
    exams: Exam[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const examApi = {
  getAll: async (params?: ExamListParams) => {
    const response = await apiClient.get<ExamListResponse>('/exams', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Exam }>(`/exams/${id}`);
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Exam }>('/exams', data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await apiClient.patch<{ success: boolean; data: Exam }>(`/exams/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(`/exams/${id}`);
    return response.data;
  },
};
