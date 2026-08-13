import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '../api/report.api';
import type { ReportsResponse, Report, DashboardStatsResponse, StatisticsResponse } from '../types/report.types';

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  dashboards: () => [...reportKeys.all, 'dashboard'] as const,
  dashboard: (filters: Record<string, unknown>) => [...reportKeys.dashboards(), filters] as const,
  statistics: (filters: Record<string, unknown>) => [...reportKeys.all, 'statistics', filters] as const,
  recents: (filters: Record<string, unknown>) => [...reportKeys.all, 'recent', filters] as const,
  categories: () => [...reportKeys.all, 'categories'] as const,
  attendanceSummary: (filters: Record<string, unknown>) => [...reportKeys.all, 'attendance', 'summary', filters] as const,
  attendanceList: (filters: Record<string, unknown>) => [...reportKeys.all, 'attendance', 'list', filters] as const,
};

export function useReports(filters?: Record<string, unknown>) {
  return useQuery<ReportsResponse, Error>({
    queryKey: reportKeys.list(filters || {}),
    queryFn: () => reportApi.getAll(filters),
  });
}

export function useReport(id: string) {
  return useQuery<{ data: Report; success: boolean }, Error>({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportApi.getById(id),
    enabled: !!id,
  });
}

export function useReportDashboard(filters?: Record<string, unknown>) {
  return useQuery<DashboardStatsResponse, Error>({
    queryKey: reportKeys.dashboard(filters || {}),
    queryFn: () => reportApi.getDashboard(filters),
  });
}

export function useReportStatistics(filters?: Record<string, unknown>) {
  return useQuery<StatisticsResponse, Error>({
    queryKey: reportKeys.statistics(filters || {}),
    queryFn: () => reportApi.getStatistics(filters),
  });
}

export function useRecentReports(filters?: Record<string, unknown>) {
  return useQuery<{ data: Report[]; success: boolean }, Error>({
    queryKey: reportKeys.recents(filters || {}),
    queryFn: () => reportApi.getRecent(filters),
  });
}

export function useReportCategories() {
  return useQuery<{ data: string[]; success: boolean }, Error>({
    queryKey: reportKeys.categories(),
    queryFn: () => reportApi.getCategories(),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reportApi.toggleFavorite(id),
    onSuccess: () => {
      // Invalidate dashboard and lists where favorites might be tracked
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

export function useIncrementDownload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reportApi.incrementDownload(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}

export function useAttendanceSummary(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: reportKeys.attendanceSummary(filters || {}),
    queryFn: () => reportApi.getAttendanceSummary(filters),
  });
}

export function useAttendanceList(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: reportKeys.attendanceList(filters || {}),
    queryFn: () => reportApi.getAttendanceList(filters),
  });
}

export function useAttendanceExport() {
  return useMutation({
    mutationFn: (filters: Record<string, unknown>) => reportApi.getAttendanceExport(filters),
  });
}

export function useGenerateAttendanceReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: Record<string, unknown>) => reportApi.generateAttendanceReport(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const filename = `Attendance_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}
