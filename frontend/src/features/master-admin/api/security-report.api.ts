import api from "@/services/api";

export interface SecuritySummaryData {
  summary: {
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
  };
  trend: {
    dates: string[];
    incidents: number[];
  };
  byCategory: { label: string; value: number }[];
  bySeverity: { label: string; value: number }[];
}

export interface SecurityListParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;

  severity?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface SecurityListItem {
  _id: string;
  eventId: string;
  eventType: string;
  category: string;
  severity: string;
  userId: { _id: string; firstName: string; lastName: string; email: string } | null;
  companyId: { _id: string; name: string } | null;

  ipAddress: string;
  device: string;
  browser: string;
  operatingSystem: string;
  location: string;
  status: string;
  createdAt: string;
}

export interface SecurityListResponse {
  data: SecurityListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const securityReportApi = {
  getSummary: async (): Promise<SecuritySummaryData> => {
    const response = await api.get("/reports/security/statistics");
    return response.data.data;
  },

  getList: async (params?: SecurityListParams): Promise<SecurityListResponse> => {
    const response = await api.get("/reports/security/list", { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  exportData: async (params?: SecurityListParams): Promise<string> => {
    const response = await api.get("/reports/security/export", {
      params,
    });
    return response.data.data;
  },

  generateReport: async (params?: SecurityListParams): Promise<Blob> => {
    const response = await api.post("/reports/security/generate", params, {
      responseType: "blob",
    });
    return response.data;
  },
};
