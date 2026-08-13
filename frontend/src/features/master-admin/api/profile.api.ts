import api from "@/services/api";

export const profileApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  updateProfileImage: async (profileImage: string) => {
    const response = await api.patch('/users/profile-image', { profileImage });
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get('/users/sessions');
    return response.data;
  },

  removeSession: async (sessionId: string) => {
    const response = await api.delete(`/users/sessions/${sessionId}`);
    return response.data;
  },

  getDevices: async () => {
    const response = await api.get('/users/devices');
    return response.data;
  },

  trustDevice: async (deviceId: string) => {
    const response = await api.patch(`/users/devices/${deviceId}/trust`);
    return response.data;
  },

  removeDevice: async (deviceId: string) => {
    const response = await api.delete(`/users/devices/${deviceId}`);
    return response.data;
  },

  updatePreferences: async (data: any) => {
    const response = await api.patch('/users/preferences', data);
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/security/recent-activities');
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await api.get('/security/audit');
    return response.data;
  }
};
