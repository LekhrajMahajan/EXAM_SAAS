// src/config/routes.ts — named route path constants
// Single source of truth for all route strings.

export const ROUTES = {
  // Root
  HOME: '/',
  NOT_FOUND: '*',

  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    OTP: '/auth/otp',
  },

  // Master Admin
  MASTER_ADMIN: {
    ROOT: '/master-admin',
    COMPANIES: '/master-admin/companies',
    EXAMS: '/master-admin/exams',
    REPORTS: '/master-admin/reports',
    SETTINGS: '/master-admin/settings',
  },

  // Company
  COMPANY: {
    ROOT: '/company',
    BRANCHES: '/company/branches',
    CENTERS: '/company/centers',
    CANDIDATES: '/company/candidates',
    PAYMENTS: '/company/payments',
  },

  // Exam flow
  EXAM: '/exam',
  PAPER: '/paper',
  QUESTION_BANK: '/question-bank',
  RESULT: '/result',
  MERIT: '/merit',
  CERTIFICATE: '/certificate',

  // Operations
  ENTRY: '/entry',
  BIOMETRIC: '/biometric',
  SEAT_ALLOCATION: '/seat-allocation',
  SHIFT: '/shift',
  LIVE_MONITORING: '/live-monitoring',
  GEO_MONITORING: '/geo-monitoring',

  // Stakeholders
  OBSERVER: '/observer',
  CANDIDATE: '/candidate',

  // Common
  NOTIFICATION: '/notifications',
  SETTINGS: '/settings',
  REPORT: '/report',
  PAYMENT: '/payment',
} as const
