import api from '@/services/api';
import type { AuditLog, AuditLogsResponse } from '../types/audit-log.types';

export const auditLogApi = {
  getAll: async (params?: Record<string, unknown>): Promise<AuditLogsResponse> => {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: AuditLog; success: boolean }> => {
    const response = await api.get(`/audit-logs/${id}`);
    return response.data;
  },
};
