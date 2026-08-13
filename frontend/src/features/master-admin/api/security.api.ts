import api from '@/services/api';
import type { ApiResponse } from '@/types';
import type { IIpRule, IpRuleStatistics, IAuthPolicy, ISecurityEventFilters, IThreatStatistics, ISecurityEvent } from '../types/security.types';

export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  onlineUsers: number;
  lockedAccounts: number;
  suspendedAccounts: number;
  failedLoginsToday: number;
  passwordResetsToday: number;
  activeTrustedDevices: number;
  blockedDevices: number;
  whitelistedIps: number;
  blacklistedIps: number;
  activeMfaUsers: number;
  securityAlerts: number;
  securityHealthScore: number;
}

export interface SecurityAlert {
  _id: string;
  action: string;
  severity: string;
  description: string;
  createdAt: string;
  performedBy?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

export interface LoginAnalyticsData {
  date: string;
  successful: number;
  failed: number;
}

export interface RecentActivity {
  _id: string;
  action: string;
  description: string;
  ipAddress?: string;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
  createdAt: string;
  severity: string;
  performedBy?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

export interface SessionData {
  _id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  role: string;
  companyId: string;
  deviceId?: string;
  ipAddress?: string;
  browser?: string;
  operatingSystem?: string;
  loginAt: string;
  lastActivityAt?: string;
  expiresAt: string;
}

export interface SessionStatistics {
  total: number;
  active: number;
  expired: number;
  concurrentUsers: number;
}

export interface DeviceData {
  _id: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  role: string;
  companyId: string;
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  ipAddress?: string;
  location?: string;
  trusted: boolean;
  isBlocked: boolean;
  riskScore: number;
  firstLoginAt?: string;
  lastLoginAt?: string;
}

export interface DeviceStatistics {
  total: number;
  trusted: number;
  blocked: number;
  highRisk: number;
}

const BASE_PATH = '/security';

export const securityApi = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>(`${BASE_PATH}/dashboard`);
    return data;
  },
  
  getSecurityAlerts: async (): Promise<ApiResponse<SecurityAlert[]>> => {
    const { data } = await api.get<ApiResponse<SecurityAlert[]>>(`${BASE_PATH}/alerts`);
    return data;
  },

  getLoginAnalytics: async (): Promise<ApiResponse<LoginAnalyticsData[]>> => {
    const { data } = await api.get<ApiResponse<LoginAnalyticsData[]>>(`${BASE_PATH}/login-analytics`);
    return data;
  },

  getRecentActivities: async (): Promise<ApiResponse<RecentActivity[]>> => {
    const { data } = await api.get<ApiResponse<RecentActivity[]>>(`${BASE_PATH}/recent-activities`);
    return data;
  },

  getSessions: async (params?: Record<string, any>): Promise<ApiResponse<{ sessions: SessionData[], pagination: any }>> => {
    const { data } = await api.get<ApiResponse<{ sessions: SessionData[], pagination: any }>>(`${BASE_PATH}/sessions`, { params });
    return data;
  },

  getSessionStatistics: async (): Promise<ApiResponse<SessionStatistics>> => {
    const { data } = await api.get<ApiResponse<SessionStatistics>>(`${BASE_PATH}/sessions/statistics`);
    return data;
  },

  getSessionById: async (sessionId: string): Promise<ApiResponse<SessionData>> => {
    const { data } = await api.get<ApiResponse<SessionData>>(`${BASE_PATH}/sessions/${sessionId}`);
    return data;
  },

  terminateSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`${BASE_PATH}/sessions/${sessionId}`);
    return data;
  },

  logoutAllSessions: async (userId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.post<ApiResponse<null>>(`${BASE_PATH}/sessions/logout-all`, { userId });
    return data;
  },

  revokeRefreshToken: async (userId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.post<ApiResponse<null>>(`${BASE_PATH}/sessions/revoke-refresh`, { userId });
    return data;
  },

  getDevices: async (params?: Record<string, any>): Promise<ApiResponse<{ devices: DeviceData[], pagination: any }>> => {
    const { data } = await api.get<ApiResponse<{ devices: DeviceData[], pagination: any }>>(`${BASE_PATH}/devices`, { params });
    return data;
  },

  getDeviceStatistics: async (): Promise<ApiResponse<DeviceStatistics>> => {
    const { data } = await api.get<ApiResponse<DeviceStatistics>>(`${BASE_PATH}/devices/statistics`);
    return data;
  },

  getDeviceById: async (deviceId: string): Promise<ApiResponse<DeviceData>> => {
    const { data } = await api.get<ApiResponse<DeviceData>>(`${BASE_PATH}/devices/${deviceId}`);
    return data;
  },

  trustDevice: async (deviceId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.patch<ApiResponse<null>>(`${BASE_PATH}/devices/${deviceId}/trust`);
    return data;
  },

  untrustDevice: async (deviceId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.patch<ApiResponse<null>>(`${BASE_PATH}/devices/${deviceId}/untrust`);
    return data;
  },

  blockDevice: async (deviceId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.patch<ApiResponse<null>>(`${BASE_PATH}/devices/${deviceId}/block`);
    return data;
  },

  unblockDevice: async (deviceId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.patch<ApiResponse<null>>(`${BASE_PATH}/devices/${deviceId}/unblock`);
    return data;
  },

  removeDevice: async (deviceId: string): Promise<ApiResponse<any>> => {
    const { data } = await api.delete<ApiResponse<any>>(`${BASE_PATH}/devices/${deviceId}`);
    return data;
  },

  // --- IP Rule Management ---
  
  getIpRules: async (params?: Record<string, any>): Promise<ApiResponse<{ docs: IIpRule[], total: number, page: number, totalPages: number }>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/ip-rules`, { params });
    return data;
  },

  getIpRuleById: async (id: string): Promise<ApiResponse<IIpRule>> => {
    const { data } = await api.get<ApiResponse<IIpRule>>(`${BASE_PATH}/ip-rules/${id}`);
    return data;
  },

  createIpRule: async (payload: Partial<IIpRule>): Promise<ApiResponse<IIpRule>> => {
    const { data } = await api.post<ApiResponse<IIpRule>>(`${BASE_PATH}/ip-rules`, payload);
    return data;
  },

  updateIpRule: async (id: string, payload: Partial<IIpRule>): Promise<ApiResponse<IIpRule>> => {
    const { data } = await api.patch<ApiResponse<IIpRule>>(`${BASE_PATH}/ip-rules/${id}`, payload);
    return data;
  },

  deleteIpRule: async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await api.delete<ApiResponse<any>>(`${BASE_PATH}/ip-rules/${id}`);
    return data;
  },

  getIpRuleStatistics: async (): Promise<ApiResponse<IpRuleStatistics>> => {
    const { data } = await api.get<ApiResponse<IpRuleStatistics>>(`${BASE_PATH}/ip-rules/statistics`);
    return data;
  },

  importIpRules: async (file: File): Promise<ApiResponse<{ imported: number, failed: number }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<ApiResponse<any>>(`${BASE_PATH}/ip-rules/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  },

  exportIpRules: async (): Promise<Blob> => {
    const { data } = await api.get(`${BASE_PATH}/ip-rules/export`, { responseType: 'blob' });
    return data;
  },
  // ==========================================
  // AUTHENTICATION POLICIES
  // ==========================================

  getAuthPolicies: async (): Promise<ApiResponse<IAuthPolicy>> => {
    const { data } = await api.get<ApiResponse<IAuthPolicy>>(`${BASE_PATH}/auth-policies`);
    return data;
  },

  updateAuthPolicies: async (payload: Partial<IAuthPolicy>): Promise<ApiResponse<IAuthPolicy>> => {
    const { data } = await api.patch<ApiResponse<IAuthPolicy>>(`${BASE_PATH}/auth-policies`, payload);
    return data;
  },

  resetAuthPolicies: async (): Promise<ApiResponse<IAuthPolicy>> => {
    const { data } = await api.post<ApiResponse<IAuthPolicy>>(`${BASE_PATH}/auth-policies/reset`);
    return data;
  },

  // ==========================================
  // MULTI-FACTOR AUTHENTICATION (MFA)
  // ==========================================

  getMfaSettings: async (): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/mfa/settings`);
    return data;
  },

  updateMfaSettings: async (updates: Partial<any>): Promise<ApiResponse<any>> => {
    const { data } = await api.patch<ApiResponse<any>>(`${BASE_PATH}/mfa/settings`, updates);
    return data;
  },

  getMfaStatistics: async (): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/mfa/statistics`);
    return data;
  },

  getMfaUsers: async (page: number, limit: number): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/mfa/users`, { params: { page, limit } });
    return data;
  },

  disableMfaUser: async (userId: string): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>(`${BASE_PATH}/mfa/users/${userId}/disable`);
    return data;
  },

  resetMfaUser: async (userId: string): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>(`${BASE_PATH}/mfa/users/${userId}/reset`);
    return data;
  },

  generateRecoveryCodes: async (userId: string): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>(`${BASE_PATH}/mfa/users/${userId}/recovery-codes`);
    return data;
  },

  // ==========================================
  // THREAT DETECTION & SECURITY EVENTS
  // ==========================================

  getSecurityEvents: async (filters: ISecurityEventFilters, page: number = 1, limit: number = 20): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/events`, {
      params: { ...filters, page, limit }
    });
    return data;
  },

  getSecurityEventStatistics: async (): Promise<ApiResponse<IThreatStatistics>> => {
    const { data } = await api.get<ApiResponse<IThreatStatistics>>(`${BASE_PATH}/events/statistics`);
    return data;
  },

  getSecurityEventDetails: async (id: string): Promise<ApiResponse<ISecurityEvent>> => {
    const { data } = await api.get<ApiResponse<ISecurityEvent>>(`${BASE_PATH}/events/${id}`);
    return data;
  },

  updateSecurityEventStatus: async (id: string, status: string): Promise<ApiResponse<ISecurityEvent>> => {
    const { data } = await api.patch<ApiResponse<ISecurityEvent>>(`${BASE_PATH}/events/${id}`, { status });
    return data;
  },

  assignSecurityEvent: async (id: string, userId: string): Promise<ApiResponse<ISecurityEvent>> => {
    const { data } = await api.post<ApiResponse<ISecurityEvent>>(`${BASE_PATH}/events/${id}/assign`, { userId });
    return data;
  },

  // ==========================================
  // AUDIT LOGS & COMPLIANCE
  // ==========================================

  getAuditLogs: async (params?: Record<string, any>): Promise<ApiResponse<{ docs: any[], total: number, page: number, totalPages: number }>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/audit`, { params });
    return data;
  },

  getAuditLogById: async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/audit/${id}`);
    return data;
  },

  getAuditStatistics: async (companyId?: string): Promise<ApiResponse<any>> => {
    const params = companyId ? { companyId } : {};
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/audit/statistics`, { params });
    return data;
  },

  exportAuditLogs: async (params?: Record<string, any>): Promise<Blob> => {
    const { data } = await api.get(`${BASE_PATH}/audit/export`, { params, responseType: 'blob' });
    return data;
  },

  getComplianceSettings: async (companyId?: string): Promise<ApiResponse<any>> => {
    const params = companyId ? { companyId } : {};
    const { data } = await api.get<ApiResponse<any>>(`${BASE_PATH}/compliance/settings`, { params });
    return data;
  },

  updateComplianceSettings: async (payload: Partial<any>, companyId?: string): Promise<ApiResponse<any>> => {
    const params = companyId ? { companyId } : {};
    const { data } = await api.patch<ApiResponse<any>>(`${BASE_PATH}/compliance/settings`, payload, { params });
    return data;
  }
};
