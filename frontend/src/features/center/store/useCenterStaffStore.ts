import { create } from 'zustand';
import { api as apiClient } from '@/features/auth/utils/axios';

export interface CenterStaff {
  id: string;
  staffId?: string;
  name: string;
  role: 'Supervisor' | 'Invigilator' | 'Biometric Coordinator' | 'Observer' | 'Security Lead' | 'Technical Support' | 'Center Superintendent' | string;
  aadharNumber: string;
  mobileNumber: string;
  email?: string;
  otpVerified: boolean;
  status: 'Active' | 'On Leave' | 'Deassigned' | string;
  createdAt: string;
}

export interface CenterStaffStoreState {
  staffList: CenterStaff[];
  isLoading: boolean;
  error: string | null;

  // Staff actions
  fetchStaff: (centerId?: string) => Promise<void>;
  addStaff: (staff: Omit<CenterStaff, 'id' | 'createdAt' | 'staffId'>, centerId?: string) => Promise<{ success: boolean; message?: string; id?: string }>;
  updateStaff: (id: string, updated: Partial<CenterStaff>) => Promise<{ success: boolean; message?: string }>;
  deleteStaff: (id: string) => Promise<void>;
  verifyStaffOtp: (id: string, otp: string) => Promise<void>;
  checkMobileExists: (mobileNumber: string, excludeId?: string) => boolean;
}

export const useCenterStaffStore = create<CenterStaffStoreState>((set, get) => ({
  staffList: [],
  isLoading: false,
  error: null,

  fetchStaff: async (centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/centers/staff/all?centerId=${centerId}` : '/centers/staff/all';
      const response = await apiClient.get(url);
      set({ staffList: response.data?.data || [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to fetch center staff.' });
    } finally {
      set({ isLoading: false });
    }
  },

  addStaff: async (staffData, centerId?: string) => {
    try {
      const payload = centerId ? { ...staffData, centerId } : staffData;
      const response = await apiClient.post('/centers/staff/create', payload);
      const newStaff = response.data?.data;
      if (newStaff) {
        set((state) => ({ staffList: [newStaff, ...state.staffList] }));
        return { success: true, id: newStaff.staffId || newStaff.id };
      }
      return { success: false, message: response.data?.message || 'Failed to add staff.' };
    } catch (error: any) {
      return { success: false, message: error?.response?.data?.message || 'An error occurred.' };
    }
  },

  updateStaff: async (id, updatedData) => {
    try {
      const response = await apiClient.put(`/centers/staff/${id}`, updatedData);
      const updatedStaff = response.data?.data;
      if (updatedStaff) {
        set((state) => ({
          staffList: state.staffList.map((s) => (s.id === id || s.staffId === id ? { ...s, ...updatedStaff } : s)),
        }));
        return { success: true };
      }
      return { success: false, message: 'Failed to update staff.' };
    } catch (error: any) {
      return { success: false, message: error?.response?.data?.message || 'An error occurred.' };
    }
  },

  deleteStaff: async (id) => {
    try {
      await apiClient.delete(`/centers/staff/${id}`);
      set((state) => ({
        staffList: state.staffList.filter((s) => s.id !== id && s.staffId !== id),
      }));
    } catch (error) {
      console.error('Failed to delete staff', error);
    }
  },

  verifyStaffOtp: async (id, otp) => {
    try {
      await apiClient.patch(`/centers/staff/${id}/verify-otp`, { otp });
      set((state) => ({
        staffList: state.staffList.map((s) => (s.id === id || s.staffId === id ? { ...s, otpVerified: true } : s)),
      }));
    } catch (error) {
      console.error('Failed to verify OTP', error);
    }
  },

  checkMobileExists: (mobileNumber, excludeId) => {
    const list = get().staffList;
    return list.some((s) => s.mobileNumber === mobileNumber && s.id !== excludeId && s.staffId !== excludeId);
  },
}));
