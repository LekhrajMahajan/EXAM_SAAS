import { create } from 'zustand';
import { apiClient } from '@/core/api/http/axios-client';

export interface PhotoField {
  url: string;
  status: 'Pending' | 'Uploaded' | 'Approved' | 'Rejected';
}

export interface CenterPhotosData {
  frontFacade: PhotoField;
  computerLab1: PhotoField;
  serverRoom: PhotoField;
  cctvRoom: PhotoField;
}

interface CenterPhotoStore {
  data: CenterPhotosData | null;
  isLoading: boolean;
  error: string | null;
  fetchPhotos: (centerId?: string) => Promise<void>;
  updatePhoto: (category: keyof CenterPhotosData, url: string, status?: string) => Promise<void>;
}

export const useCenterPhotoStore = create<CenterPhotoStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchPhotos: async (centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/centers/photos?centerId=${centerId}` : '/centers/photos';
      const response = await apiClient.get(url);
      set({ data: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch center photos',
        isLoading: false,
      });
    }
  },

  updatePhoto: async (category, url, status = 'Uploaded') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/centers/photos', { category, url, status });
      set({ data: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update center photo',
        isLoading: false,
      });
      throw error;
    }
  },
}));
