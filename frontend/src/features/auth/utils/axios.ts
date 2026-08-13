import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import type { AuthResponse } from '../types';
import { handleSessionExpired } from './error.handlers';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create the axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401s and token refreshing
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentRefreshToken = useAuthStore.getState().refreshToken;
        
        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh token API directly using fetch or a separate axios instance 
        // to avoid interceptor loops if the refresh endpoint also returns 401
        const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/refresh-token`, {
          refreshToken: currentRefreshToken,
        });
        
        const { token, refreshToken } = response.data;
        
        // Update the store
        useAuthStore.getState().setTokens(token, refreshToken);

        // Update the original request's auth header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, call centralized session expired handler
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
