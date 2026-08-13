import { tokenStorage } from '../storage/token.storage';
import { resetAllStores } from '@/stores/utils/storeReset';

let isRedirecting = false;

export const handleUnauthorized = () => {
  // Clear local token storage & reset all Zustand stores first
  tokenStorage.clearTokens();
  resetAllStores();

  if (isRedirecting || window.location.pathname.startsWith('/auth/login')) {
    return;
  }
  isRedirecting = true;
  
  window.location.href = '/auth/login?reason=unauthorized';
};

export const handleForbidden = () => {
  console.warn('User attempted to access a forbidden resource.');
  // Redirect to a dedicated 403 page or dashboard
};

export const handleSessionExpired = () => {
  tokenStorage.clearTokens();
  resetAllStores();

  if (isRedirecting || window.location.pathname.startsWith('/auth/login')) {
    return;
  }
  isRedirecting = true;
  window.location.href = '/auth/login?reason=expired';
};
