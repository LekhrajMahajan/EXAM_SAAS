import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth/auth.store';
import { useUserStore } from '@/stores/user/user.store';
import { usePermissionStore } from '@/stores/permissions/permission.store';
import { tokenStorage } from '../storage/token.storage';
import { authService } from '../services/auth.service';
import { resetAllStores } from '@/stores/utils/storeReset';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialized = useRef(false);

  useEffect(() => {
    // Hydrate token once on mount only.
    // IMPORTANT: Do NOT add store state/functions to the dep array here.
    // resetAllStores() calls logout() which changes `status`, which would
    // re-fire this effect and create an infinite reload loop.
    const hydrateSession = async () => {
      const tokens = tokenStorage.getTokens();
      if (tokens) {
        try {
          // Set to loading so guards like RoleGuard wait
          useAuthStore.setState({ status: 'loading' });

          const response = await authService.getProfile();

          if (response.success && response.data) {
            const { role, permissions, ...profileData } = response.data;

            // Populate user store
            useUserStore.getState().setProfile({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              roleId: role,
              companyId: profileData.companyId,
              subscriptionPlan: profileData.subscriptionPlan,
              paymentStatus: profileData.paymentStatus,
              subscriptionEndDate: profileData.subscriptionEndDate,
              planFeatures: profileData.planFeatures,
              onboardingCompleted: profileData.onboardingCompleted,
            });

            // Populate permissions store
            usePermissionStore.getState().setPermissions({
              roles: role ? [role] : [],
              permissions: permissions || [],
            });

            // Set authenticated status
            useAuthStore.getState().login({
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            });
          } else {
            resetAllStores();
          }
        } catch {
          resetAllStores();
        }
      } else {
        resetAllStores();
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      hydrateSession();
    }
  }, []);

  return <>{children}</>;
};
