import { create } from 'zustand';
import { apiClient } from '@/core/api/http/axios-client';

export interface CenterLocationData {
  latitude: number | string;
  longitude: number | string;
  googleMapUrl: string;
}

interface CenterLocationStore {
  data: CenterLocationData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchLocation: (centerId?: string) => Promise<void>;
  updateLocation: (data: CenterLocationData) => Promise<{ success: boolean; message?: string }>;
}

export const useCenterLocationStore = create<CenterLocationStore>((set) => ({
  data: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchLocation: async (centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/centers/location?centerId=${centerId}` : '/centers/location';
      const response = await apiClient.get(url);
      const location = response.data?.data || {};
      
      set({ 
        data: {
          latitude: location.latitude || '',
          longitude: location.longitude || '',
          googleMapUrl: location.googleMapUrl || ''
        }, 
        isLoading: false 
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch center location',
        isLoading: false,
      });
    }
  },

  updateLocation: async (locationData) => {
    set({ isSaving: true, error: null });
    try {
      const response = await apiClient.patch('/centers/location', locationData);
      const updated = response.data?.data;
      
      set({ 
        data: {
          latitude: updated.latitude || locationData.latitude,
          longitude: updated.longitude || locationData.longitude,
          googleMapUrl: updated.googleMapUrl || locationData.googleMapUrl
        }, 
        isSaving: false 
      });
      return { success: true, message: response.data?.message };
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update center location',
        isSaving: false,
      });
      return { success: false, message: error.response?.data?.message || 'Failed to update center location' };
    }
  },
}));
