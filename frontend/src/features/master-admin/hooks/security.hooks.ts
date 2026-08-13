import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { securityApi } from '../api/security.api';
import { useToast } from '../../../hooks/use-toast';
import type { IAuthPolicy, ISecurityEventFilters } from '../types/security.types';

// Refresh every 60 seconds
const REFRESH_INTERVAL = 60000;

export const useSecurityDashboardStats = () => {
  return useQuery({
    queryKey: ['security', 'dashboard-stats'],
    queryFn: securityApi.getDashboardStats,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useSecurityAlerts = () => {
  return useQuery({
    queryKey: ['security', 'alerts'],
    queryFn: securityApi.getSecurityAlerts,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useSecurityLoginAnalytics = () => {
  return useQuery({
    queryKey: ['security', 'login-analytics'],
    queryFn: securityApi.getLoginAnalytics,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useSecurityRecentActivities = () => {
  return useQuery({
    queryKey: ['security', 'recent-activities'],
    queryFn: securityApi.getRecentActivities,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useGetLoginSessions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['security', 'sessions', params],
    queryFn: () => securityApi.getSessions(params),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useGetSessionStatistics = () => {
  return useQuery({
    queryKey: ['security', 'sessions-statistics'],
    queryFn: securityApi.getSessionStatistics,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useGetSessionById = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: ['security', 'session', sessionId],
    queryFn: () => securityApi.getSessionById(sessionId),
    enabled: !!sessionId && enabled,
  });
};

export const useTerminateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => securityApi.terminateSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'sessions-statistics'] });
    },
  });
};

export const useForceLogoutAll = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => securityApi.logoutAllSessions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'sessions-statistics'] });
    },
  });
};

export const useRevokeRefreshToken = () => {
  return useMutation({
    mutationFn: (userId: string) => securityApi.revokeRefreshToken(userId),
  });
};

export const useGetDevices = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['security', 'devices', params],
    queryFn: () => securityApi.getDevices(params),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useGetDeviceStatistics = () => {
  return useQuery({
    queryKey: ['security', 'devices-statistics'],
    queryFn: securityApi.getDeviceStatistics,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useGetDeviceById = (deviceId: string, enabled = true) => {
  return useQuery({
    queryKey: ['security', 'device', deviceId],
    queryFn: () => securityApi.getDeviceById(deviceId),
    enabled: !!deviceId && enabled,
  });
};

export const useTrustDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => securityApi.trustDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'devices'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'devices-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'device'] });
    },
  });
};

export const useUntrustDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => securityApi.untrustDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'devices'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'devices-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'device'] });
    },
  });
};

export const useBlockDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => securityApi.blockDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'devices'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'devices-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'device'] });
    },
  });
};

export const useUnblockDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => securityApi.unblockDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'devices'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'devices-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'device'] });
    },
  });
};

export const useRemoveDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => securityApi.removeDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'devices'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'devices-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'device'] });
    },
  });
};

// --- IP Rule Hooks ---

export const useGetIpRules = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['security', 'ip-rules', params],
    queryFn: () => securityApi.getIpRules(params),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useGetIpRuleById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['security', 'ip-rule', id],
    queryFn: () => securityApi.getIpRuleById(id),
    enabled: !!id && enabled,
  });
};

export const useGetIpRuleStatistics = () => {
  return useQuery({
    queryKey: ['security', 'ip-rules-statistics'],
    queryFn: () => securityApi.getIpRuleStatistics(),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useCreateIpRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: any) => securityApi.createIpRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules-statistics'] });
    },
  });
};

export const useUpdateIpRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => securityApi.updateIpRule(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rule', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules-statistics'] });
    },
  });
};

export const useDeleteIpRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => securityApi.deleteIpRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules-statistics'] });
    },
  });
};

export const useImportIpRules = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => securityApi.importIpRules(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules'] });
      queryClient.invalidateQueries({ queryKey: ['security', 'ip-rules-statistics'] });
    },
  });
};

// --- Authentication Policies Hooks ---

export const useGetAuthPolicies = () => {
  return useQuery({
    queryKey: ['security', 'authPolicies'],
    queryFn: () => securityApi.getAuthPolicies(),
  });
};

// ==========================================
// MULTI-FACTOR AUTHENTICATION (MFA)
// ==========================================

export const useGetMfaSettings = () => {
  return useQuery({
    queryKey: ["mfaSettings"],
    queryFn: securityApi.getMfaSettings,
  });
};

export const useUpdateMfaSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (updates: Partial<any>) => securityApi.updateMfaSettings(updates),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["mfaSettings"] });
      toast({
        title: "Success",
        description: response.message || "MFA Policies updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update MFA Policies",
        variant: "destructive",
      });
    },
  });
};

export const useGetMfaStatistics = () => {
  return useQuery({
    queryKey: ["mfaStatistics"],
    queryFn: securityApi.getMfaStatistics,
  });
};

export const useGetMfaUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["mfaUsers", page, limit],
    queryFn: () => securityApi.getMfaUsers(page, limit),
  });
};

export const useDisableMfaUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => securityApi.disableMfaUser(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["mfaUsers"] });
      toast({
        title: "Success",
        description: response.message || "User MFA disabled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to disable MFA",
        variant: "destructive",
      });
    },
  });
};

export const useResetMfaUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => securityApi.resetMfaUser(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["mfaUsers"] });
      toast({
        title: "Success",
        description: response.message || "User MFA reset successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset MFA",
        variant: "destructive",
      });
    },
  });
};

export const useGenerateRecoveryCodes = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => securityApi.generateRecoveryCodes(userId),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "Recovery codes generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate recovery codes",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAuthPolicies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IAuthPolicy>) => securityApi.updateAuthPolicies(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'authPolicies'] });
      // Add toast notification logic if necessary
    },
  });
};

export const useResetAuthPolicies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => securityApi.resetAuthPolicies(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'authPolicies'] });
    },
  });
};

// ==========================================
// THREAT DETECTION & SECURITY EVENTS
// ==========================================

export const useSecurityEvents = (filters: ISecurityEventFilters, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['security', 'events', filters, page, limit],
    queryFn: () => securityApi.getSecurityEvents(filters, page, limit),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useSecurityEventStatistics = () => {
  return useQuery({
    queryKey: ['security', 'events', 'statistics'],
    queryFn: securityApi.getSecurityEventStatistics,
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useSecurityEventDetails = (id: string) => {
  return useQuery({
    queryKey: ['security', 'events', id],
    queryFn: () => securityApi.getSecurityEventDetails(id),
    enabled: !!id,
  });
};

export const useUpdateSecurityEventStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      securityApi.updateSecurityEventStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'events'] });
      toast({
        title: 'Status Updated',
        description: 'Security event status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update event status.',
        variant: 'destructive',
      });
    }
  });
};

export const useAssignSecurityEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => 
      securityApi.assignSecurityEvent(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security', 'events'] });
      toast({
        title: 'Event Assigned',
        description: 'Security event has been assigned successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to assign event.',
        variant: 'destructive',
      });
    }
  });
};

// ==========================================
// AUDIT LOGS & COMPLIANCE
// ==========================================

export const useSecurityAuditLogs = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['security', 'auditLogs', filters],
    queryFn: () => securityApi.getAuditLogs(filters),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useAuditLogDetails = (id: string) => {
  return useQuery({
    queryKey: ['security', 'auditLogs', id],
    queryFn: () => securityApi.getAuditLogById(id),
    enabled: !!id,
  });
};

export const useAuditStatistics = (companyId?: string) => {
  return useQuery({
    queryKey: ['security', 'auditStatistics', companyId],
    queryFn: () => securityApi.getAuditStatistics(companyId),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useExportAuditLogs = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (filters: Record<string, any>) => securityApi.exportAuditLogs(filters),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit-logs.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      toast({
        title: 'Export Failed',
        description: error?.response?.data?.message || 'Failed to export audit logs.',
        variant: 'destructive',
      });
    }
  });
};

export const useComplianceSettings = (companyId?: string) => {
  return useQuery({
    queryKey: ['security', 'complianceSettings', companyId],
    queryFn: () => securityApi.getComplianceSettings(companyId),
  });
};

export const useUpdateComplianceSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ data, companyId }: { data: Partial<any>, companyId?: string }) => 
      securityApi.updateComplianceSettings(data, companyId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['security', 'complianceSettings', variables.companyId] });
      toast({
        title: 'Settings Updated',
        description: 'Compliance settings have been successfully updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update compliance settings.',
        variant: 'destructive',
      });
    }
  });
};

