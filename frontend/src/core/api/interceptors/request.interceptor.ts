import type { InternalAxiosRequestConfig } from 'axios';
import { ApiConfig } from '../config/api.config';
import { tokenStorage } from '@/features/auth/storage/token.storage';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const getFallbackAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed?.state?.token) {
        return parsed.state.token as string;
      }
    }
  } catch {
    // Ignore parse error
  }
  return null;
};

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Add Request ID
  config.headers['X-Request-ID'] = ApiConfig.generateRequestId();
  
  // Add App Version
  config.headers['X-App-Version'] = ApiConfig.version;
  
  // Retrieve token from local storage or zustand store
  const token =
    tokenStorage.getAccessToken() ||
    useAuthStore.getState().token ||
    getFallbackAuthToken() ||
    localStorage.getItem('token') ||
    localStorage.getItem('examguard_auth_tokens');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

export const requestErrorInterceptor = (error: unknown) => {
  return Promise.reject(error);
};
