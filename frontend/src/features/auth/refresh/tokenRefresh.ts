import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/auth.store';
import { tokenStorage } from '../storage/token.storage';
import { authService } from '../services/auth.service';
import { handleSessionExpired } from '../utils/error.handlers';

/**
 * Placeholder logic for interceptor-level token refresh synchronization.
 * In a real implementation, the Axios interceptor in `core/api/` would call this.
 */
export const useTokenRefresh = () => {
  const { isAuthenticated, refreshToken } = useAuthStore();

  // Background proactive refresh placeholder
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return;
    
    // Proactive refresh mechanism could go here.
    // However, our primary reliance is on the Axios response interceptor capturing 401s
    // and calling `forceTokenRefresh()` below.
  }, [isAuthenticated, refreshToken]);
};

// Exported standalone for the Axios Interceptor to utilize outside of React Context
export const forceTokenRefresh = async () => {
  const refreshToken = tokenStorage.getRefreshToken();
  try {
    if (!refreshToken) throw new Error('No refresh token available');

    const res = await authService.refresh(refreshToken);
    
    // Update local storage
    tokenStorage.setTokens({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      expiresIn: 3600
    });

    // We must update Zustand directly since we are outside a React Hook
    useAuthStore.getState().login({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken
    });

    return res.data.accessToken;
  } catch (error) {
    handleSessionExpired(); // Flushes stores and redirects
    throw error;
  }
};
