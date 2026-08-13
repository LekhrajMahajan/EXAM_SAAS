import { create } from 'zustand';
import { apiClient } from '@/core/api/http/axios-client';

export interface CenterPayment {
  id: string;
  _id: string;
  companyId: string;
  centerId: string;
  shiftId: any;
  examId: any;
  amount: number;
  paymentDate: string;
  status: 'Paid' | 'Pending' | 'Processing' | 'Failed';
  paymentMethod?: string;
  referenceNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface CenterPaymentsStoreState {
  paymentsList: CenterPayment[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: (centerId: string) => Promise<void>;
}

export const useCenterPaymentsStore = create<CenterPaymentsStoreState>((set) => ({
  paymentsList: [],
  isLoading: false,
  error: null,

  fetchPayments: async (centerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/center-payments', { params: { centerId } });
      if (response.data && response.data.data) {
        const formatted = response.data.data.map((item: any) => ({
          ...item,
          id: item._id,
        }));
        set({ paymentsList: formatted });
      }
    } catch (error: any) {
      console.error('Failed to fetch center payments', error);
      set({ error: error?.response?.data?.message || 'Failed to fetch payments' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
