import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";

export const useProfile = () => {
  return useQuery({
    queryKey: ['master-admin', 'profile'],
    queryFn: profileApi.getProfile
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'profile'] });
    }
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'profile'] });
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword
  });
};

export const useUserSessions = () => {
  return useQuery({
    queryKey: ['master-admin', 'sessions'],
    queryFn: profileApi.getSessions
  });
};

export const useRemoveSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.removeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'sessions'] });
    }
  });
};

export const useUserDevices = () => {
  return useQuery({
    queryKey: ['master-admin', 'devices'],
    queryFn: profileApi.getDevices
  });
};

export const useTrustDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.trustDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'devices'] });
    }
  });
};

export const useRemoveDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.removeDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'devices'] });
    }
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-admin', 'profile'] });
    }
  });
};

export const useUserActivities = () => {
  return useQuery({
    queryKey: ['master-admin', 'recent-activities'],
    queryFn: profileApi.getRecentActivities
  });
};

export const useUserAuditLogs = () => {
  return useQuery({
    queryKey: ['master-admin', 'audit-logs'],
    queryFn: profileApi.getAuditLogs
  });
};
