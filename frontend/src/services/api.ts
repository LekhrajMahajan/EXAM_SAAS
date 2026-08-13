// src/services/api.ts
// Axios instance — central HTTP client with interceptors.
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config'
import type { ApiError } from '@/types'
import { tokenStorage } from '@/features/auth/storage/token.storage'
import { handleSessionExpired } from '@/features/auth/utils/error.handlers'

// ─── Instance ────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: env.api.baseUrl,
  timeout: env.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ─────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// ─── Response Interceptor ────────────────────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 — attempt token refresh once (skip for login requests)
    const isLoginRequest = originalRequest.url?.includes('/auth/login')
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true
      const refreshToken = tokenStorage.getRefreshToken()
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${env.api.baseUrl}/auth/refresh-token`, { refreshToken })
          
          const currentTokens = tokenStorage.getTokens();
          if (currentTokens) {
            tokenStorage.setTokens({
              ...currentTokens,
              accessToken: data.data.accessToken
            });
          }
          
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
          return api(originalRequest)
        } catch {
          handleSessionExpired()
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
