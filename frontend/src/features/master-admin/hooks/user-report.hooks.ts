import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userReportApi } from '../api/user-report.api';

export const userReportKeys = {
  all: ['user-reports'] as const,
  summary: (params: Record<string, unknown>) => [...userReportKeys.all, 'summary', params] as const,
  list: (params: Record<string, unknown>) => [...userReportKeys.all, 'list', params] as const,
  loginHistory: (params: Record<string, unknown>) => [...userReportKeys.all, 'login-history', params] as const,
  roles: (params: Record<string, unknown>) => [...userReportKeys.all, 'roles', params] as const,
  export: (params: Record<string, unknown>) => [...userReportKeys.all, 'export', params] as const,
};

export function useUserReportSummary(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: userReportKeys.summary(params || {}),
    queryFn: () => userReportApi.getSummary(params),
  });
}

export function useUserReportList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: userReportKeys.list(params || {}),
    queryFn: () => userReportApi.getUsersList(params),
    placeholderData: (prev) => prev,
  });
}

export function useUserLoginHistory(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: userReportKeys.loginHistory(params || {}),
    queryFn: () => userReportApi.getLoginHistory(params),
    placeholderData: (prev) => prev,
  });
}

export function useUserRolesReport(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: userReportKeys.roles(params || {}),
    queryFn: () => userReportApi.getRolesReport(params),
  });
}

export function useUserReportExport(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: userReportKeys.export(params || {}),
    queryFn: () => userReportApi.getExport(params),
    enabled: false, // Only run on demand
  });
}

export const useGenerateUserReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: Record<string, unknown>) => userReportApi.generateReport(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const filename = `User_Access_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
