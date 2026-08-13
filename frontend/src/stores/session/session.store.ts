import { create } from 'zustand';

interface SessionState {
  status: 'active' | 'idle' | 'expired';
  isTimeoutWarningOpen: boolean;
  deviceInfo: Record<string, any> | null;
  
  setStatus: (status: SessionState['status']) => void;
  showTimeoutWarning: (show: boolean) => void;
  setDeviceInfo: (info: Record<string, any>) => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  status: 'active',
  isTimeoutWarningOpen: false,
  deviceInfo: null,
  
  setStatus: (status) => set({ status }),
  showTimeoutWarning: (show) => set({ isTimeoutWarningOpen: show }),
  setDeviceInfo: (info) => set({ deviceInfo: info }),
}));
