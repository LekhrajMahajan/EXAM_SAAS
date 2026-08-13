// src/config/constants.ts
// Application-wide constants.

export const APP_CONSTANTS = {
  APP_NAME: 'ExamGuard Pro',
  TOKEN_KEY: 'examguard_token',
  REFRESH_TOKEN_KEY: 'examguard_refresh_token',
  THEME_KEY: 'examguard_theme',
  LOCALE_KEY: 'examguard_locale',
  DEFAULT_LOCALE: 'en',
  DEFAULT_PAGE_SIZE: 20,
  MAX_UPLOAD_SIZE_MB: 10,
} as const

export const QUERY_KEYS = {
  USER: 'user',
  EXAMS: 'exams',
  QUESTIONS: 'questions',
  RESULTS: 'results',
  ANALYTICS: 'analytics',
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  EXAMS: '/exams',
  QUESTIONS: '/questions',
  RESULTS: '/results',
  USERS: '/users',
  ANALYTICS: '/analytics',
} as const
