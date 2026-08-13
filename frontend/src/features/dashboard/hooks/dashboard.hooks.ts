import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

/**
 * Primary hook — works for ALL roles.
 * Calls GET /dashboard/role-stats which is dynamically scoped by JWT role.
 */
export const useRoleDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'role-stats'],
    queryFn: dashboardApi.getRoleDashboardStats,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Legacy hook — retained for ExamManager backward compat.
 */
export const useExamManagerDashboardCards = () => {
  return useQuery({
    queryKey: ['dashboard', 'exam-manager', 'cards'],
    queryFn: dashboardApi.getExamManagerCards,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Company admin aggregate hook.
 */
export const useCompanyDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'company', 'aggregate'],
    queryFn: dashboardApi.getCompanyDashboardData,
    staleTime: 3 * 60 * 1000,
  });
};
