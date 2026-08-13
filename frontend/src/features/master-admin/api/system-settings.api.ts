import api from '@/services/api';
import type { SystemSetting, SystemSettingsResponse } from '../types/system-settings.types';

export const systemSettingsApi = {
  getAll: async (): Promise<SystemSettingsResponse> => {
    const response = await api.get('/system-settings');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: SystemSetting; success: boolean }> => {
    const response = await api.get(`/system-settings/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<SystemSetting>): Promise<{ data: SystemSetting; success: boolean }> => {
    const response = await api.patch(`/system-settings/${id}`, data);
    return response.data;
  },

  getGeneralSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/GENERAL');
    return response.data;
  },

  updateGeneralSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/general', data);
    return response.data;
  },

  resetGeneralSettings: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/reset', { category: 'GENERAL' });
    return response.data;
  },

  getSystemInfo: async (): Promise<{ data: any; success: boolean }> => {
    const response = await api.get('/system-settings/system-info');
    return response.data;
  },

  getExamSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/EXAM');
    return response.data;
  },

  updateExamSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/EXAM', data);
    return response.data;
  },

  resetExamSettings: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/reset', { category: 'EXAM' });
    return response.data;
  },

  getOrganizationSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/organization');
    return response.data;
  },

  getPublicSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/public');
    return response.data;
  },

  updateOrganizationSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/organization', data);
    return response.data;
  },

  uploadOrganizationLogo: async (key: string, file: File): Promise<{ data: { url: string }; success: boolean }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/system-settings/organization/logo/${key}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteOrganizationLogo: async (key: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/system-settings/organization/logo/${key}`);
    return response.data;
  },

  getSecuritySettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/SECURITY');
    return response.data;
  },

  updateSecuritySettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/SECURITY', data);
    return response.data;
  },

  getNotificationSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/NOTIFICATIONS');
    return response.data;
  },

  updateNotificationSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/NOTIFICATIONS', data);
    return response.data;
  },

  getSmtpSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/SMTP');
    return response.data;
  },

  updateSmtpSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/SMTP', data);
    return response.data;
  },

  testEmailGateway: async (data: { to: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/email-gateway/test', data);
    return response.data;
  },

  getSmsSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/SMS');
    return response.data;
  },

  updateSmsSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/SMS', data);
    return response.data;
  },

  testSmsGateway: async (data: { phone: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/sms-gateway/test', data);
    return response.data;
  },

  getStorageSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/STORAGE');
    return response.data;
  },

  updateStorageSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/STORAGE', data);
    return response.data;
  },

  testStorageGateway: async (): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await api.post('/system-settings/storage-gateway/test');
    return response.data;
  },

  switchStorageProvider: async (provider: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/storage-gateway/provider/switch', { provider });
    return response.data;
  },

  getBackupSettings: async (): Promise<{ data: SystemSetting[]; success: boolean }> => {
    const response = await api.get('/system-settings/category/BACKUP');
    return response.data;
  },

  updateBackupSettings: async (data: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/system-settings/category/BACKUP', data);
    return response.data;
  },

  triggerBackup: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/backup/trigger');
    return response.data;
  },

  restoreBackup: async (backupId: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system-settings/backup/restore', { backupId, password });
    return response.data;
  },

  getBackupHistory: async (): Promise<{ data: any[]; success: boolean }> => {
    const response = await api.get('/system-settings/backup/history');
    return response.data;
  },
};
