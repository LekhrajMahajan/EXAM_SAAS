import api from '@/services/api';
import type { 
  IConfigurationHistory, 
  ConfigurationHistoryFilters, 
  ConfigurationComparison,
  ConfigurationApprovalStatus
} from '../types/configuration-history.types';

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const configurationHistoryApi = {
  getHistory: async (filters: ConfigurationHistoryFilters): Promise<PaginatedResponse<IConfigurationHistory>> => {
    const response = await api.get('/system-settings/configuration-history', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: IConfigurationHistory; message: string }> => {
    const response = await api.get(`/system-settings/configuration-history/${id}`);
    return response.data;
  },

  compareVersions: async (id1: string, id2: string): Promise<{ success: boolean; data: ConfigurationComparison; message: string }> => {
    const response = await api.post('/system-settings/configuration-history/compare', { id1, id2 });
    return response.data;
  },

  rollback: async (id: string, reason?: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/system-settings/configuration-history/${id}/rollback`, { reason });
    return response.data;
  },

  approve: async (id: string, status: ConfigurationApprovalStatus, notes?: string): Promise<{ success: boolean; data: any; message: string }> => {
    const response = await api.post(`/system-settings/configuration-history/${id}/approve`, { status, notes });
    return response.data;
  },

  exportHistory: async (filters: ConfigurationHistoryFilters): Promise<{ success: boolean; data: any; message: string }> => {
    const response = await api.get('/system-settings/configuration-history/export', { params: filters });
    return response.data;
  }
};
