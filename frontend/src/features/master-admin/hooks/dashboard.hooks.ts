import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardFilter } from '../types/dashboard.types';

const QUERY_KEYS = {
  all: ['dashboard'] as const,
  overview: (params?: DashboardFilter) => [...QUERY_KEYS.all, 'overview', params] as const,
  cards: (params?: DashboardFilter) => [...QUERY_KEYS.all, 'cards', params] as const,
  companies: (params?: DashboardFilter) => [...QUERY_KEYS.all, 'companies', params] as const,
  employees: (params?: DashboardFilter) => [...QUERY_KEYS.all, 'employees', params] as const,
  systemHealth: () => [...QUERY_KEYS.all, 'system-health'] as const,
};

export const useDashboardOverview = (params?: DashboardFilter) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', params],
    queryFn: () => dashboardApi.getOverview(params),
  });
};

export const useDashboardCharts = (params?: DashboardFilter) => {
  return useQuery({
    queryKey: ['dashboard', 'charts', params],
    queryFn: () => dashboardApi.getCharts(params),
  });
};

export const useDashboardCards = (params?: DashboardFilter) => {
  return useQuery({
    queryKey: QUERY_KEYS.cards(params),
    queryFn: () => dashboardApi.getCards(params),
  });
};

export const useDashboardCompanyStatistics = (params?: DashboardFilter) => {
  return useQuery({
    queryKey: QUERY_KEYS.companies(params),
    queryFn: () => dashboardApi.getCompanyStatistics(params),
  });
};

export const useDashboardEmployeeStatistics = (params?: DashboardFilter) => {
  return useQuery({
    queryKey: QUERY_KEYS.employees(params),
    queryFn: () => dashboardApi.getEmployeeStatistics(params),
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: QUERY_KEYS.systemHealth(),
    queryFn: () => dashboardApi.getSystemHealth(),
  });
};
