import api from '@/services/api';
import type { ApiResponse } from '@/types';
import type { 
  DashboardOverview, 
  DashboardCard, 
  CompanyStatistics, 
  EmployeeStatistics, 
  SystemHealth, 
  DashboardFilter,
  IDashboardCharts
} from '../types/dashboard.types';

const BASE_PATH = '/dashboard';

export const dashboardApi = {
  getOverview: async (params?: DashboardFilter): Promise<ApiResponse<DashboardOverview>> => {
    const { data } = await api.get<ApiResponse<DashboardOverview>>(`${BASE_PATH}/overview`, { params });
    return data;
  },

  getCharts: async (params?: DashboardFilter): Promise<ApiResponse<IDashboardCharts>> => {
    const { data } = await api.get<ApiResponse<IDashboardCharts>>(`${BASE_PATH}/charts`, { params });
    return data;
  },

  getCards: async (params?: DashboardFilter): Promise<ApiResponse<DashboardCard[]>> => {
    const { data } = await api.get<ApiResponse<DashboardCard[]>>(`${BASE_PATH}/cards`, { params });
    return data;
  },

  getCompanyStatistics: async (params?: DashboardFilter): Promise<ApiResponse<CompanyStatistics>> => {
    const { data } = await api.get<ApiResponse<CompanyStatistics>>(`${BASE_PATH}/companies`, { params });
    return data;
  },

  getEmployeeStatistics: async (params?: DashboardFilter): Promise<ApiResponse<EmployeeStatistics>> => {
    const { data } = await api.get<ApiResponse<EmployeeStatistics>>(`${BASE_PATH}/employees`, { params });
    return data;
  },

  getSystemHealth: async (): Promise<ApiResponse<SystemHealth>> => {
    const { data } = await api.get<ApiResponse<SystemHealth>>(`${BASE_PATH}/system-health`);
    return data;
  },
};
