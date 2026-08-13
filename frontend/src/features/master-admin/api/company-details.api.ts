import api from '@/services/api';
import type { PaginatedResponse } from '@/types';

// For summary stats, we only need pagination.total, so we use any for the data type.
export const companyDetailsApi = {
  getBranchSummary: async (companyId: string) => {
    const { data } = await api.get<PaginatedResponse<any>>('/branches', {
      params: { companyId, limit: 1, page: 1 },
    });
    return data;
  },

  getCenterSummary: async (companyId: string) => {
    const { data } = await api.get<PaginatedResponse<any>>('/centers', {
      params: { companyId, limit: 1, page: 1 },
    });
    return data;
  },

  getEmployeeSummary: async (companyId: string) => {
    const { data } = await api.get<PaginatedResponse<any>>('/employees', {
      params: { companyId, limit: 1, page: 1 },
    });
    return data;
  },

  getExamSummary: async (companyId: string) => {
    const { data } = await api.get<PaginatedResponse<any>>('/exams', {
      params: { companyId, limit: 1, page: 1 },
    });
    return data;
  },

  getCandidateSummary: async (companyId: string) => {
    const { data } = await api.get<PaginatedResponse<any>>('/candidates', {
      params: { companyId, limit: 1, page: 1 },
    });
    return data;
  },

  getActivityTimeline: async (companyId: string, limit: number = 10) => {
    const { data } = await api.get<PaginatedResponse<any>>('/activity-logs', {
      params: { companyId, limit, page: 1 },
    });
    return data;
  },
};
