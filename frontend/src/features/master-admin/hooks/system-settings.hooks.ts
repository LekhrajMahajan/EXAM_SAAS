import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemSettingsApi } from '../api/system-settings.api';
import type { SystemSettingsResponse, SystemSetting } from '../types/system-settings.types';

export const systemSettingsKeys = {
  all: ['system-settings'] as const,
  lists: () => [...systemSettingsKeys.all, 'list'] as const,
  list: () => [...systemSettingsKeys.lists()] as const,
  details: () => [...systemSettingsKeys.all, 'detail'] as const,
  detail: (id: string) => [...systemSettingsKeys.details(), id] as const,
};

export function useSystemSettings() {
  return useQuery<SystemSettingsResponse, Error>({
    queryKey: systemSettingsKeys.list(),
    queryFn: () => systemSettingsApi.getAll(),
  });
}

export function useSystemSetting(id: string) {
  return useQuery<{ data: SystemSetting; success: boolean }, Error>({
    queryKey: systemSettingsKeys.detail(id),
    queryFn: () => systemSettingsApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateSystemSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SystemSetting> }) =>
      systemSettingsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.detail(variables.id) });
    },
  });
}

export function useGeneralSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'general'],
    queryFn: () => systemSettingsApi.getGeneralSettings(),
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'general'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useResetGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => systemSettingsApi.resetGeneralSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'general'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useSystemInfo() {
  return useQuery<{ data: any; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'system-info'],
    queryFn: () => systemSettingsApi.getSystemInfo(),
  });
}

export function useExamSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'exam'],
    queryFn: () => systemSettingsApi.getExamSettings(),
  });
}

export function useUpdateExamSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateExamSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'exam'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useResetExamSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => systemSettingsApi.resetExamSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'exam'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useOrganizationSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'organization'],
    queryFn: () => systemSettingsApi.getOrganizationSettings(),
  });
}

export function usePublicSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'public'],
    queryFn: () => systemSettingsApi.getPublicSettings(),
  });
}

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateOrganizationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'organization'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useUploadOrganizationLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, file }: { key: string; file: File }) => systemSettingsApi.uploadOrganizationLogo(key, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'organization'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useDeleteOrganizationLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => systemSettingsApi.deleteOrganizationLogo(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'organization'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useSecuritySettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'security'],
    queryFn: () => systemSettingsApi.getSecuritySettings(),
  });
}

  export function useUpdateSecuritySettings() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: Record<string, any>) => systemSettingsApi.updateSecuritySettings(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'security'] });
        queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
      },
    });
  }

export function useNotificationSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'notifications'],
    queryFn: () => systemSettingsApi.getNotificationSettings(),
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'notifications'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useSmtpSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'smtp'],
    queryFn: () => systemSettingsApi.getSmtpSettings(),
  });
}

export function useUpdateSmtpSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateSmtpSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'smtp'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useTestEmailGateway() {
  return useMutation({
    mutationFn: (data: { to: string }) => systemSettingsApi.testEmailGateway(data),
  });
}

export function useSmsSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'sms'],
    queryFn: () => systemSettingsApi.getSmsSettings(),
  });
}

export function useUpdateSmsSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateSmsSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'sms'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useTestSmsGateway() {
  return useMutation({
    mutationFn: (data: { phone: string }) => systemSettingsApi.testSmsGateway(data),
  });
}

export function useStorageSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'storage'],
    queryFn: () => systemSettingsApi.getStorageSettings(),
  });
}

export function useUpdateStorageSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateStorageSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'storage'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useTestStorageGateway() {
  return useMutation({
    mutationFn: () => systemSettingsApi.testStorageGateway(),
  });
}

export function useSwitchStorageProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => systemSettingsApi.switchStorageProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'storage'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

// ==========================================
// BACKUP & RESTORE HOOKS
// ==========================================

export function useBackupSettings() {
  return useQuery<{ data: SystemSetting[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'backup'],
    queryFn: () => systemSettingsApi.getBackupSettings(),
  });
}

export function useUpdateBackupSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => systemSettingsApi.updateBackupSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'backup'] });
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.list() });
    },
  });
}

export function useTriggerBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => systemSettingsApi.triggerBackup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'backup-history'] });
    },
  });
}

export function useRestoreBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ backupId, password }: { backupId: string, password?: string }) => systemSettingsApi.restoreBackup(backupId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...systemSettingsKeys.all, 'backup-history'] });
    },
  });
}

export function useBackupHistory() {
  return useQuery<{ data: any[]; success: boolean }, Error>({
    queryKey: [...systemSettingsKeys.all, 'backup-history'],
    queryFn: () => systemSettingsApi.getBackupHistory(),
  });
}

