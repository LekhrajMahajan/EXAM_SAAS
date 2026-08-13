import api from '@/services/api';

export interface CreateOrderPayload {
  companyId: string;
  planId: string;
  amount: number;
}

export interface CreateOrderResponse {
  payment: { _id: string; [key: string]: unknown };
  orderId: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const paymentApi = {
  getAll:       (params?: unknown) => api.get('/payments', { params }),
  getById:      (id: string) => api.get(`/payments/${id}`),
  processRefund:(id: string, reason: string) => api.post(`/payments/${id}/refund`, { reason }),
  export:       () => api.get('/payments/export?format=csv', { responseType: 'blob' }),

  createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const { data } = await api.post<{ data: CreateOrderResponse }>('/payments/create-order', payload);
    return data.data;
  },

  verifyPayment: async (payload: VerifyPaymentPayload): Promise<unknown> => {
    const { data } = await api.post('/payments/verify', payload);
    return data;
  },
};
