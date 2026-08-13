import { apiClient } from '@/core/api/http/axios-client';

export interface TopicListParams {
  subjectId?: string;
  chapterId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface Topic {
  _id: string;
  subjectId: any;
  subjectName?: string;
  chapterId: string;
  topicCode: string;
  topicName: string;
  topicNumber: number;
  description?: string;
  status: string;
}

export interface TopicListResponse {
  success: boolean;
  data: {
    topics: Topic[];
    total: number;
  };
}

export const topicApi = {
  getAll: async (params?: TopicListParams) => {
    const response = await apiClient.get<TopicListResponse>('/topics', { params });
    return response.data;
  },
  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Topic }>('/topics', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(`/topics/${id}`);
    return response.data;
  }
};
