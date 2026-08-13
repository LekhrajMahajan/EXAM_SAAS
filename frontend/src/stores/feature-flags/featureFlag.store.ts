import { create } from 'zustand';

interface FeatureFlagState {
  enabledFeatures: string[];
  betaFeatures: string[];
  experimentalFeatures: string[];
  
  setFlags: (flags: Partial<FeatureFlagState>) => void;
  isFeatureEnabled: (feature: string) => boolean;
}

export const useFeatureFlagStore = create<FeatureFlagState>()((set, get) => ({
  enabledFeatures: [],
  betaFeatures: [],
  experimentalFeatures: [],
  
  setFlags: (flags) => set((state) => ({ ...state, ...flags })),
  
  isFeatureEnabled: (feature) => {
    const state = get();
    return state.enabledFeatures.includes(feature) || 
           state.betaFeatures.includes(feature) || 
           state.experimentalFeatures.includes(feature);
  }
}));
