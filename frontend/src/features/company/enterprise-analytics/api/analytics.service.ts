import { apiClient as api } from "@/core/api/http/axios-client";
import type {
  AnalyticsFilter,
  ExecutiveDashboardData,
  HeatmapsData,
  GlobalSearchResult,
  DashboardPersonalization,
} from "../types/analytics.types";

export const analyticsService = {
  getDashboard: async (params?: AnalyticsFilter): Promise<{ success: boolean; data: ExecutiveDashboardData }> => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  getCandidates: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/candidates', { params });
    return response.data;
  },

  getExams: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/exams', { params });
    return response.data;
  },

  getResults: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/results', { params });
    return response.data;
  },

  getAttendance: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/attendance', { params });
    return response.data;
  },

  getBranches: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/branches', { params });
    return response.data;
  },

  getCenters: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/centers', { params });
    return response.data;
  },

  getEmployees: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/employees', { params });
    return response.data;
  },

  getAssignments: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/assignments', { params });
    return response.data;
  },

  getFinance: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/finance', { params });
    return response.data;
  },

  getLive: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/live', { params });
    return response.data;
  },

  getTrustScores: async (params?: AnalyticsFilter) => {
    const response = await api.get('/analytics/trust-scores', { params });
    return response.data;
  },

  getHeatmaps: async (params?: AnalyticsFilter): Promise<{ success: boolean; data: HeatmapsData }> => {
    const response = await api.get('/analytics/heatmaps', { params });
    return response.data;
  },

  search: async (query: string, params?: AnalyticsFilter): Promise<{ success: boolean; data: GlobalSearchResult }> => {
    const response = await api.get('/analytics/search', { params: { ...params, q: query } });
    return response.data;
  },

  exportReports: async (data: { category: string; format: string; notes?: string }) => {
    const response = await api.post('/analytics/export', data);
    return response.data;
  },

  scheduleReport: async (data: { title: string; frequency: string; reportType: string; format: string; recipients: string[] }) => {
    const response = await api.post('/analytics/schedule', data);
    return response.data;
  },

  getPersonalization: async (): Promise<{ success: boolean; data: DashboardPersonalization }> => {
    const response = await api.get('/analytics/personalization');
    return response.data;
  },

  savePersonalization: async (data: Partial<DashboardPersonalization>): Promise<{ success: boolean; data: DashboardPersonalization }> => {
    const response = await api.post('/analytics/personalization', data);
    return response.data;
  },
};
