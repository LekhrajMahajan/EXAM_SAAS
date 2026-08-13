import { useQuery } from '@tanstack/react-query';
import { auditLogApi } from '../api/audit-log.api';
import type { AuditLogsResponse, AuditLog } from '../types/audit-log.types';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...auditLogKeys.lists(), filters] as const,
  details: () => [...auditLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditLogKeys.details(), id] as const,
};

export function useAuditLogs(filters?: Record<string, unknown>) {
  return useQuery<AuditLogsResponse, Error>({
    queryKey: auditLogKeys.list(filters || {}),
    queryFn: () => auditLogApi.getAll(filters),
  });
}

export function useAuditLog(id: string) {
  return useQuery<{ data: AuditLog; success: boolean }, Error>({
    queryKey: auditLogKeys.detail(id),
    queryFn: () => auditLogApi.getById(id),
    enabled: !!id,
  });
}

export function useRecentAuditLogs(limit: number = 5) {
  return useQuery<AuditLogsResponse, Error>({
    queryKey: [...auditLogKeys.lists(), { limit }],
    queryFn: () => auditLogApi.getAll({ limit, sort: '-createdAt' }),
  });
}
