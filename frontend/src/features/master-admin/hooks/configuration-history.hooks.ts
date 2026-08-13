import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configurationHistoryApi } from '../api/configuration-history.api';
import type { ConfigurationHistoryFilters, ConfigurationApprovalStatus } from '../types/configuration-history.types';
import toast from 'react-hot-toast';

export const useConfigurationHistory = (filters: ConfigurationHistoryFilters) => {
  return useQuery({
    queryKey: ['configurationHistory', filters],
    queryFn: () => configurationHistoryApi.getHistory(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useConfigurationHistoryById = (id: string) => {
  return useQuery({
    queryKey: ['configurationHistory', id],
    queryFn: () => configurationHistoryApi.getById(id),
    enabled: !!id,
  });
};

export const useCompareConfigurations = () => {
  return useMutation({
    mutationFn: ({ id1, id2 }: { id1: string; id2: string }) => configurationHistoryApi.compareVersions(id1, id2),
  });
};

export const useRollbackConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => configurationHistoryApi.rollback(id, reason),
    onSuccess: (data) => {
      toast.success(data.message || 'Configuration successfully rolled back.');
      queryClient.invalidateQueries({ queryKey: ['configurationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to rollback configuration.');
    },
  });
};

export const useApproveConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: ConfigurationApprovalStatus; notes?: string }) => 
      configurationHistoryApi.approve(id, status, notes),
    onSuccess: (data) => {
      toast.success(data.message || 'Configuration status updated.');
      queryClient.invalidateQueries({ queryKey: ['configurationHistory'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update approval status.');
    },
  });
};

export const useExportConfigurationHistory = () => {
  return useMutation({
    mutationFn: (filters: ConfigurationHistoryFilters) => configurationHistoryApi.exportHistory(filters),
    onSuccess: (data) => {
      toast.success(data.message || 'Export successful.');
      // In a real scenario, convert JSON to CSV/Excel and trigger download here.
      // For now, we just output stringified JSON.
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'configuration_history_export.json');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to export history.');
    },
  });
};
