import { create } from 'zustand';
import { apiClient } from '@/core/api/http/axios-client';

export interface CenterInfrastructureData {
  spaceAndFacilities: {
    totalArea: string;
    examRooms: string;
    washrooms: string;
    parkingCapacity: string;
  };
  technical: {
    serverRooms: string;
    powerBackup: string;
    internetISP: string;
    internetSpeed: string;
  };
  security: {
    cctvCameras: string;
    biometricDevices: string;
    friskingEnclosures: string;
    baggageCounter: string;
  };
}

interface CenterInfrastructureState {
  data: CenterInfrastructureData | null;
  isLoading: boolean;
  error: string | null;
  fetchInfrastructure: (centerId?: string) => Promise<void>;
  saveInfrastructure: (data: CenterInfrastructureData) => Promise<void>;
}

export const useCenterInfrastructureStore = create<CenterInfrastructureState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchInfrastructure: async (centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/centers/infrastructure?centerId=${centerId}` : '/centers/infrastructure';
      const response = await apiClient.get(url);
      set({ data: response.data.infrastructure, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching center infrastructure:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch infrastructure details',
        isLoading: false,
      });
    }
  },

  saveInfrastructure: async (data: CenterInfrastructureData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/centers/infrastructure', data);
      set({ data: response.data.infrastructure, isLoading: false });
    } catch (error: any) {
      console.error('Error saving center infrastructure:', error);
      set({
        error: error.response?.data?.message || 'Failed to save infrastructure details',
        isLoading: false,
      });
      throw error;
    }
  },
}));
