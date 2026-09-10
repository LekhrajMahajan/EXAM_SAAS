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




