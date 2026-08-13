import { apiClient } from '@/core/api/http/axios-client';
import type { GenerateNotePayload, UpdateInvoiceStatusPayload } from '../types/invoice.types';

export const invoiceApi = {
  getAll: (params?: Record<string, unknown>) => apiClient.get('/invoices', { params }),
  getById: (id: string) => apiClient.get(`/invoices/${id}`),
  downloadPdf: (id: string) => apiClient.get(`/invoices/${id}/download`, { responseType: 'blob' }),
  resendEmail: (id: string, payload: { to: string; cc?: string; message?: string }) => apiClient.post(`/invoices/${id}/resend`, payload),
  getDashboardStats: (params?: Record<string, unknown>) => apiClient.get('/invoices/dashboard-stats', { params }),
  getDashboardCharts: (params?: Record<string, unknown>) => apiClient.get('/invoices/dashboard/charts', { params }),
  getTopCompanies: (params?: Record<string, unknown>) => apiClient.get('/invoices/dashboard/top-companies', { params }),
  updateStatus: (id: string, payload: UpdateInvoiceStatusPayload) => apiClient.patch(`/invoices/${id}/status`, payload),
  generateCreditNote: (id: string, payload: GenerateNotePayload) => apiClient.post(`/invoices/${id}/credit-note`, payload),
  generateDebitNote: (id: string, payload: GenerateNotePayload) => apiClient.post(`/invoices/${id}/debit-note`, payload),
  getCreditNotes: (id: string) => apiClient.get(`/invoices/${id}/credit-notes`),
  getDebitNotes: (id: string) => apiClient.get(`/invoices/${id}/debit-notes`),
};
