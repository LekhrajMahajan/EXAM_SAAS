import api from '@/services/api';
import type { ActivityLog, ActivityLogsResponse, ActivityDashboardResponse, ActivityStatisticsResponse } from '../types/activity-log.types';

export const activityLogApi = {
  getAll: async (params?: Record<string, unknown>): Promise<ActivityLogsResponse> => {
    const response = await api.get('/activity-logs', { params });
    const payload = response.data.data;
    return {
      success: response.data.success,
      message: response.data.message,
      data: payload.data || [],
      pagination: {
        total: payload.total || 0,
        page: payload.page || 1,
        limit: payload.limit || 10,
        totalPages: payload.totalPages || 0,
      }
    };
  },

  getById: async (id: string): Promise<{ data: ActivityLog; success: boolean }> => {
    const response = await api.get(`/activity-logs/${id}`);
    return response.data;
  },

  getDashboard: async (params?: Record<string, unknown>): Promise<ActivityDashboardResponse> => {
    const response = await api.get('/activity-logs/dashboard', { params });
    return response.data;
  },

  getStatistics: async (params?: Record<string, unknown>): Promise<ActivityStatisticsResponse> => {
    const response = await api.get('/activity-logs/statistics', { params });
    return response.data;
  },

  getRecent: async (params?: Record<string, unknown>): Promise<ActivityLogsResponse> => {
    const response = await api.get('/activity-logs/recent', { params });
    // getRecent returns an array directly in data
    return { 
      success: response.data.success,
      message: response.data.message,
      data: response.data.data, 
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } 
    };
  },
};
