import { create } from 'zustand';
import api from '@/services/api';
import type { ImportedCandidate } from './candidateImport.store';

interface SeatAllocationState {
  unassignedCandidates: ImportedCandidate[];
  allocations: ImportedCandidate[];
  isLoading: boolean;
  error: string | null;
  fetchUnassignedCandidates: (examId: string, centerId?: string) => Promise<void>;
  assignLab: (examId: string, labId: string, candidateIds: string[]) => Promise<boolean>;
  fetchAllocations: (examId: string, centerId?: string) => Promise<void>;
}

export const useSeatAllocationStore = create<SeatAllocationState>((set) => ({
  unassignedCandidates: [],
  allocations: [],
  isLoading: false,
  error: null,
  fetchUnassignedCandidates: async (examId: string, centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/import-candidate/unassigned/${examId}?centerId=${centerId}` : `/import-candidate/unassigned/${examId}`;
      const response = await api.get(url);
      if (response.data.success) {
        set({ unassignedCandidates: Array.isArray(response.data.data) ? response.data.data : [], isLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'An error occurred', isLoading: false });
    }
  },
  assignLab: async (examId: string, labId: string, candidateIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/import-candidate/assign-lab', { examId, labId, candidateIds });
      if (response.data.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ error: response.data.message || 'Failed to assign', isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'An error occurred', isLoading: false });
      return false;
    }
  },
  fetchAllocations: async (examId: string, centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/import-candidate/allocations/${examId}?centerId=${centerId}` : `/import-candidate/allocations/${examId}`;
      const response = await api.get(url);
      if (response.data.success) {
        set({ allocations: response.data.data, isLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'An error occurred', isLoading: false });
    }
  }
}));
