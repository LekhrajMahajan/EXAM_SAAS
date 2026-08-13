import { create } from 'zustand';
import { apiClient } from '@/core/api/http/axios-client';


export interface CenterLab {
  id: string;
  labName: string;
  labCode: string;
  roomFloor: string;
  centerName: string;
  seatingCapacity: number;
  totalComputers: number;
  assignedSupervisor: string;
  facilities: string[];
  status: 'Exam Ready' | 'Under Maintenance' | 'Reserved' | string;
  notes?: string;
}

interface CenterLabStore {
  labsList: CenterLab[];
  isLoading: boolean;
  error: string | null;

  fetchLabs: (centerId?: string) => Promise<void>;
  addLab: (lab: Omit<CenterLab, 'id'>, centerId?: string) => Promise<{ success: boolean; message?: string; id?: string }>;
  updateLab: (id: string, lab: Partial<CenterLab>) => Promise<{ success: boolean; message?: string }>;
  deleteLab: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export const useCenterLabStore = create<CenterLabStore>((set) => ({
  labsList: [],
  isLoading: false,
  error: null,

  fetchLabs: async (centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/centers/labs?centerId=${centerId}` : '/centers/labs';
      const response = await apiClient.get(url);
      const apiLabs = response.data?.data || [];
      const mappedLabs: CenterLab[] = apiLabs.map((lab: any) => ({
        id: lab._id || lab.labId || lab.id,
        labName: lab.labName,
        labCode: lab.labCode,
        roomFloor: lab.roomFloor || '',
        centerName: lab.centerName || '',
        seatingCapacity: lab.seatingCapacity || 0,
        totalComputers: lab.totalComputers || 0,
        assignedSupervisor: lab.assignedSupervisor || 'Unassigned',
        facilities: lab.facilities || [],
        status: lab.status || 'Exam Ready',
        notes: lab.notes || '',
      }));
      set({ labsList: mappedLabs, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch labs', isLoading: false });
    }
  },

  addLab: async (labData, centerId?: string) => {
    try {
      const payload = centerId ? { ...labData, centerId } : labData;
      const response = await apiClient.post('/centers/labs', payload);
      const newLab = response.data?.data;
      
      const mappedLab: CenterLab = {
        id: newLab.labId || newLab.id || newLab._id,
        labName: newLab.labName,
        labCode: newLab.labCode,
        roomFloor: newLab.roomFloor || '',
        centerName: newLab.centerName || '',
        seatingCapacity: newLab.seatingCapacity || 0,
        totalComputers: newLab.totalComputers || 0,
        assignedSupervisor: newLab.assignedSupervisor || 'Unassigned',
        facilities: newLab.facilities || [],
        status: newLab.status || 'Exam Ready',
        notes: newLab.notes || '',
      };
      
      set((state) => ({
        labsList: [mappedLab, ...state.labsList]
      }));
      return { success: true, id: mappedLab.id };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create lab' };
    }
  },

  updateLab: async (id, labData) => {
    try {
      await apiClient.put(`/centers/labs/${id}`, labData);
      set((state) => ({
        labsList: state.labsList.map(lab => 
          lab.id === id ? { ...lab, ...labData } : lab
        )
      }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to update lab' };
    }
  },

  deleteLab: async (id) => {
    try {
      await apiClient.delete(`/centers/labs/${id}`);
      set((state) => ({
        labsList: state.labsList.filter(lab => lab.id !== id)
      }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete lab' };
    }
  },
}));
