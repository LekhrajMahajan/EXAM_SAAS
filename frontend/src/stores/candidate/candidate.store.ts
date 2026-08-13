import { create } from 'zustand';

interface CandidateState {
  currentCandidateId: string | null;
  candidateProfile: Record<string, any> | null;
  candidateSession: Record<string, any> | null;
  
  setCandidate: (id: string, profile: any) => void;
  updateSession: (sessionData: any) => void;
  clearCandidate: () => void;
}

export const useCandidateStore = create<CandidateState>()((set) => ({
  currentCandidateId: null,
  candidateProfile: null,
  candidateSession: null,
  
  setCandidate: (id, profile) => set({ 
    currentCandidateId: id, 
    candidateProfile: profile 
  }),
  updateSession: (sessionData) => set((state) => ({ 
    candidateSession: { ...state.candidateSession, ...sessionData } 
  })),
  clearCandidate: () => set({ 
    currentCandidateId: null, 
    candidateProfile: null, 
    candidateSession: null 
  }),
}));
