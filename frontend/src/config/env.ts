// src/config/env.ts
// Typed, validated access to all VITE_ environment variables.

export const env = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL as string,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  },
  socket: {
    url: import.meta.env.VITE_SOCKET_URL as string,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME as string,
    version: import.meta.env.VITE_APP_VERSION as string,
    env: import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production',
  },
  features: {
    devtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
    mockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
