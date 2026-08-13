import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import type { CreateOrderPayload, VerifyPaymentPayload } from '../api/payment.api';

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => paymentApi.createOrder(payload),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => paymentApi.verifyPayment(payload),
  });
}

export function usePayments(params?: any) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const { data } = await paymentApi.getAll(params);
      return data.data; // Assuming your response is { success: true, data: [...] }
    },
  });
}
