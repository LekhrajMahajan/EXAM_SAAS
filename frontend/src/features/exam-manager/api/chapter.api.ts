import { apiClient } from '@/core/api/http/axios-client';

export interface ChapterListParams {
  subjectId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface Chapter {
  _id: string;
  subjectId: string;
  chapterCode: string;
  chapterName: string;
  chapterNumber: number;
  description?: string;
  status: string;
}

export interface ChapterListResponse {
  success: boolean;
  data: {
    chapters: Chapter[];
    total: number;
  };
}

export const chapterApi = {
  getAll: async (params?: ChapterListParams) => {
    const response = await apiClient.get<ChapterListResponse>('/chapters', { params });
    return response.data;
  },
  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: Chapter }>('/chapters', data);
    return response.data;
  }
};
