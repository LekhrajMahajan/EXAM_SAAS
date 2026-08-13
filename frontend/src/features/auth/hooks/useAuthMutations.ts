import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useUserStore } from '@/stores/user/user.store';
import { usePermissionStore } from '@/stores/permissions/permission.store';
import { tokenStorage } from '../storage/token.storage';
import { resetAllStores } from '@/stores/utils/storeReset';
import type { LoginFormData, ForgotPasswordFormData } from '../schemas/auth.schema';

export const useLoginMutation = () => {
  const loginStore = useAuthStore(state => state.login);
  const setProfile = useUserStore(state => state.setProfile);
  const setPermissions = usePermissionStore(state => state.setPermissions);

  return useMutation({
    mutationFn: (credentials: LoginFormData) => authService.login(credentials),
    onSuccess: (response) => {
      // 1. Store locally for Axios Interceptor
      tokenStorage.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: 3600 // Backend should ideally provide this
      });
      
      // 2. Hydrate Zustand Auth
      loginStore({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      });
      
      // 3. Hydrate User & Roles
      setProfile({
        id: response.data.user.userId,
        name: response.data.user.name,
        email: response.data.user.email,
        roleId: response.data.user.role,
        forcePasswordChange: response.data.user.forcePasswordChange,
        branchId: response.data.user.branchId,
        branchSetupStatus: response.data.user.branchSetupStatus,
        branchSetupCurrentStep: response.data.user.branchSetupCurrentStep,
        centerId: response.data.user.centerId,
        centerSetupStatus: response.data.user.centerSetupStatus,
        centerSetupCurrentStep: response.data.user.centerSetupCurrentStep,
      });

      setPermissions({
        roles: [response.data.user.role],
        permissions: ['*'], // Backend to provide specific permissions via Profile route
        allowedModules: ['*']
      });
    }
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Always cleanup regardless of backend success
      tokenStorage.clearTokens();
      resetAllStores();
      queryClient.clear();
      window.location.href = '/auth/login';
    }
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.forgotPassword(data),
  });
};
