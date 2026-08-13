import { apiClient } from '@/core/api/http/axios-client';
import type { 
  ISubscription,
  AssignSubscriptionPayload,
  RenewSubscriptionPayload,
  ChangeSubscriptionPayload,
  StatusChangePayload
} from '../types/subscription.types';

export const subscriptionApi = {
  getDashboardStats: () => apiClient.get('/subscriptions/dashboard-stats'),
  getAll: (params?: any) => apiClient.get('/subscriptions', { params }),
  getById: (id: string) => apiClient.get(`/subscriptions/${id}`),
  assign: (data: AssignSubscriptionPayload) => apiClient.post('/subscriptions', data),
  renew: (id: string, data: RenewSubscriptionPayload) => apiClient.post(`/subscriptions/${id}/renew`, data),
  upgrade: (id: string, data: ChangeSubscriptionPayload) => apiClient.post(`/subscriptions/${id}/upgrade`, data),
  downgrade: (id: string, data: ChangeSubscriptionPayload) => apiClient.post(`/subscriptions/${id}/downgrade`, data),
  suspend: (id: string, data: StatusChangePayload) => apiClient.post(`/subscriptions/${id}/suspend`, data),
  resume: (id: string, data: StatusChangePayload) => apiClient.post(`/subscriptions/${id}/resume`, data),
  cancel: (id: string, data: StatusChangePayload) => apiClient.post(`/subscriptions/${id}/cancel`, data),
};
