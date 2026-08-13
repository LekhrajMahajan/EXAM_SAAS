import { create } from 'zustand';
import api from '@/services/api';

export interface ImportedCandidate {
  _id: string;
  candidateId: string;
  applicationNo: string;
  rollNo?: string;
  centerName: string;
  examName: string;
  examId?: any;
  candidateFullName: string;
  fatherName?: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  category?: string;
  postName?: string;
  paperSubject?: string;
  examStage?: string;
  examDate?: string;
  shift?: string;
  reportingTime?: string;
  gateClosingTime?: string;
  examStartTime?: string;
  duration?: string;
  examMode?: string;
  centreCode?: string;
  fullCentreAddress?: string;
  city?: string;
  district?: string;
  state?: string;
  pin?: string;
  landmark?: string;
  nearestRailwayStation?: string;
  language?: string;
  scribeDetails?: string;
  physicalTestDetails?: string;
  photoIdInstructions?: string;
  importantInstructions?: string;
  candidateDeclaration?: string;
  biometricInfo?: string;
  candidatePhoto?: string;
  candidateSignature?: string;
  pwdStatus?: string;
  pwdType?: string;
  organization?: string;
  examCode?: string;
  notificationNo?: string;
  importedAt: string;
  [key: string]: any;
}

interface CandidateImportState {
  importedCandidates: ImportedCandidate[];
  isLoading: boolean;
  error: string | null;
  fetchImportedCandidates: () => Promise<void>;
  updateCandidate: (id: string, data: Partial<ImportedCandidate>) => Promise<boolean>;
  deleteCandidate: (id: string) => Promise<boolean>;
  sendToCenter: (examId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
}

export const useCandidateImportStore = create<CandidateImportState>((set) => ({
  importedCandidates: [],
  isLoading: false,
  error: null,
  fetchImportedCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/import-candidate');
      if (response.data.success) {
        set({ importedCandidates: response.data.data, isLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'An error occurred', isLoading: false });
    }
  },
  updateCandidate: async (id: string, data: Partial<ImportedCandidate>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/import-candidate/${id}`, data);
      if (response.data.success) {
        set((state) => ({
          importedCandidates: state.importedCandidates.map((c) => (c._id === id ? { ...c, ...response.data.data } : c)),
          isLoading: false
        }));
        return true;
      } else {
        set({ error: response.data.message || 'Failed to update', isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'An error occurred', isLoading: false });
      return false;
    }
  },
  deleteCandidate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/import-candidate/${id}`);
      if (response.data.success) {
        set((state) => ({
          importedCandidates: state.importedCandidates.filter((c) => c._id !== id),
          isLoading: false
        }));
        return true;
      } else {
        set({ error: response.data.message || 'Failed to delete', isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'An error occurred', isLoading: false });
      return false;
    }
  },
  sendToCenter: async (examId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/import-candidate/send-to-center', { examId });
      if (response.data.success) {
        set({ isLoading: false });
        return { success: true, data: response.data.data };
      } else {
        set({ error: response.data.message || 'Failed to send to center', isLoading: false });
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'An error occurred';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  }
}));
