import { ApiClientError } from '../types/error.types';
import { HttpStatus } from '../constants/http-status';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { forceTokenRefresh } from '@/features/auth/refresh/tokenRefresh';

export const errorHandler = async (error: AxiosError<any>) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response) {
    const { status, data } = error.response;
    
    // Auth Token Refresh Logic
    const isAuthEndpoint = originalRequest.url?.includes('/auth/refresh-token') || originalRequest.url?.includes('/auth/login');
    if (status === HttpStatus.UNAUTHORIZED && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await forceTokenRefresh();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // forceTokenRefresh already calls handleSessionExpired which flushes store and redirects
        return Promise.reject(refreshError);
      }
    }
    
    throw new ApiClientError(
      data?.message || data?.error?.message || 'An error occurred with the API',
      status,
      data?.error?.code || 'API_ERROR',
      data?.error?.details
    );
  } else if (error.request) {
    throw new ApiClientError('Network Error: No response received from server', 0, 'NETWORK_ERROR');
  } else {
    throw new ApiClientError(error.message, 0, 'REQUEST_SETUP_ERROR');
  }
};
