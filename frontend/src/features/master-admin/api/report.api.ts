import api from '@/services/api';
import type { Report, ReportsResponse, DashboardStatsResponse, StatisticsResponse } from '../types/report.types';

export const reportApi = {
  getAll: async (params?: Record<string, unknown>): Promise<ReportsResponse> => {
    const response = await api.get('/reports', { params });
    const resData = response.data;
    
    // Normalize backend response { data: { data: [], total: ... } } to ReportsResponse
    if (resData.data && !Array.isArray(resData.data)) {
      return {
        success: resData.success,
        message: resData.message,
        data: resData.data.data || [],
        pagination: {
          total: resData.data.total || 0,
          page: resData.data.page || 1,
          limit: resData.data.limit || 10,
          totalPages: resData.data.totalPages || 0
        }
      };
    }
    return resData;
  },

  getById: async (id: string): Promise<{ data: Report; success: boolean }> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  getDashboard: async (params?: Record<string, unknown>): Promise<DashboardStatsResponse> => {
    const response = await api.get('/reports/dashboard', { params });
    return response.data;
  },

  getStatistics: async (params?: Record<string, unknown>): Promise<StatisticsResponse> => {
    const response = await api.get('/reports/statistics', { params });
    return response.data;
  },

  getRecent: async (params?: Record<string, unknown>): Promise<{ data: Report[]; success: boolean }> => {
    const response = await api.get('/reports/recent', { params });
    return response.data;
  },

  getCategories: async (): Promise<{ data: string[]; success: boolean }> => {
    const response = await api.get('/reports/categories');
    return response.data;
  },

  toggleFavorite: async (id: string): Promise<{ data: { isFavorite: boolean; reportId: string }; success: boolean }> => {
    const response = await api.post(`/reports/${id}/favorite`);
    return response.data;
  },

  incrementDownload: async (id: string): Promise<{ data: { downloadCount: number; reportId: string }; success: boolean }> => {
    const response = await api.post(`/reports/${id}/download`);
    return response.data;
  },

  getAttendanceSummary: async (params?: Record<string, unknown>) => {
    const response = await api.get('/reports/attendance/summary', { params });
    return response.data;
  },

  getAttendanceList: async (params?: Record<string, unknown>) => {
    const response = await api.get('/reports/attendance/list', { params });
    return response.data;
  },

  getAttendanceExport: async (params?: Record<string, unknown>) => {
    const response = await api.get('/reports/attendance/export', { params });
    return response.data;
  },

  generateAttendanceReport: async (params?: Record<string, unknown>): Promise<Blob> => {
    const response = await api.post('/reports/attendance', params, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateMasterReport: async (params: { modules: string[], [key: string]: any }): Promise<{ data: Blob, headers: any }> => {
    const response = await api.post('/reports/master', params, {
      responseType: 'blob',
      timeout: 300000, // 5 minutes
    });
    return { data: response.data, headers: response.headers };
  },
};
