import { useQuery } from '@tanstack/react-query';
import { activityLogApi } from '../api/activity-log.api';
import type { ActivityLogsResponse, ActivityLog, ActivityDashboardResponse, ActivityStatisticsResponse } from '../types/activity-log.types';

export const activityLogKeys = {
  all: ['activity-logs'] as const,
  lists: () => [...activityLogKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...activityLogKeys.lists(), filters] as const,
  details: () => [...activityLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityLogKeys.details(), id] as const,
  dashboards: () => [...activityLogKeys.all, 'dashboard'] as const,
  statistics: () => [...activityLogKeys.all, 'statistics'] as const,
};

export function useActivityLogs(filters?: Record<string, unknown>, refetchInterval?: number) {
  return useQuery<ActivityLogsResponse, Error>({
    queryKey: activityLogKeys.list(filters || {}),
    queryFn: () => activityLogApi.getAll(filters),
    refetchInterval,
  });
}

export function useActivityLog(id: string) {
  return useQuery<{ data: ActivityLog; success: boolean }, Error>({
    queryKey: activityLogKeys.detail(id),
    queryFn: () => activityLogApi.getById(id),
    enabled: !!id,
  });
}

export function useRecentActivityLogs(limit: number = 5, filters: Record<string, unknown> = {}, refetchInterval?: number) {
  return useQuery<ActivityLogsResponse, Error>({
    queryKey: [...activityLogKeys.lists(), { limit, type: 'recent', ...filters }],
    queryFn: () => activityLogApi.getRecent({ limit, ...filters }),
    refetchInterval,
  });
}

export function useActivityDashboard(filters?: Record<string, unknown>, refetchInterval?: number) {
  return useQuery<ActivityDashboardResponse, Error>({
    queryKey: [...activityLogKeys.dashboards(), filters || {}],
    queryFn: () => activityLogApi.getDashboard(filters),
    refetchInterval,
  });
}

export function useActivityStatistics(filters?: Record<string, unknown>, refetchInterval?: number) {
  return useQuery<ActivityStatisticsResponse, Error>({
    queryKey: [...activityLogKeys.statistics(), filters || {}],
    queryFn: () => activityLogApi.getStatistics(filters),
    refetchInterval,
  });
}
