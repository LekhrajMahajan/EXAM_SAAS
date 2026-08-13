import { apiClient } from '@/core/api/http/axios-client';

export interface ExamShiftListParams {
  examId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ExamShift {
  _id: string;
  examId: string;
  shiftCode: string;
  shiftName: string;
  shiftNumber: number;
  reportingTime: string;
  gateClosingTime: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalCandidates: number;
  totalCenters: number;
  totalRooms: number;
  totalSeats: number;
  status: string;
}

export interface ExamShiftListResponse {
  success: boolean;
  data: {
    examShifts: ExamShift[];
    total: number;
  };
}

export const examShiftApi = {
  getAll: async (params?: ExamShiftListParams) => {
    const response = await apiClient.get<ExamShiftListResponse>('/exam-shifts', { params });
    return response.data;
  },
  create: async (data: unknown) => {
    const response = await apiClient.post<{ success: boolean; data: ExamShift }>('/exam-shifts', data);
    return response.data;
  }
};
