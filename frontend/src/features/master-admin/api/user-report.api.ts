import api from '@/services/api';

const BASE = '/reports/users';

export interface UserReportSummary {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  suspendedUsers: number;
  totalRoles: number;
  activeSessions: number;
  permissionAssignments: number;
  loginAttemptsToday: number;
}

export interface UserReportUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
  employeeCode?: string;
  department?: string;
  company?: string;
  branch?: string;
}

export interface LoginHistoryRecord {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  loginAt: string;
  successful: boolean;
  ipAddress?: string;
  browser?: string;
  operatingSystem?: string;
  location?: string;
}

export interface LoginHistoryStats {
  totalLogins: number;
  successful: number;
  failed: number;
}

export interface LoginByDay {
  date: string;
  count: number;
  successful: number;
  failed: number;
}

export interface RoleReportData {
  usersByRole: { role: string; count: number; active: number }[];
  usersByStatus: { status: string; count: number }[];
  newUsersLast30Days: { date: string; count: number }[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const userReportApi = {
  getSummary: async (params?: Record<string, unknown>): Promise<{ data: UserReportSummary; success: boolean }> => {
    const { data } = await api.get(`${BASE}/summary`, { params });
    return data;
  },

  getUsersList: async (params?: Record<string, unknown>): Promise<{ data: UserReportUser[]; pagination: Pagination; success: boolean }> => {
    const { data } = await api.get(`${BASE}/list`, { params });
    return data;
  },

  getLoginHistory: async (params?: Record<string, unknown>): Promise<{
    data: { records: LoginHistoryRecord[]; stats: LoginHistoryStats; loginsByDay: LoginByDay[] };
    pagination: Pagination;
    success: boolean;
  }> => {
    const { data } = await api.get(`${BASE}/login-history`, { params });
    return data;
  },

  getRolesReport: async (params?: Record<string, unknown>): Promise<{ data: RoleReportData; success: boolean }> => {
    const { data } = await api.get(`${BASE}/roles`, { params });
    return data;
  },

  getExport: async (params?: Record<string, unknown>): Promise<{ data: Record<string, unknown>[]; success: boolean }> => {
    const { data } = await api.get(`${BASE}/export`, { params });
    return data;
  },

  generateReport: async (params?: Record<string, unknown>): Promise<Blob> => {
    const response = await api.post('/reports/users/generate', params, {
      responseType: 'blob',
    });
    return response.data;
  },
};
