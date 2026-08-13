import { create } from 'zustand';

interface AppState {
  version: string;
  buildInformation: Record<string, any> | null;
  isMaintenanceMode: boolean;
  networkStatus: 'online' | 'offline';
  
  setMaintenanceMode: (isMaintenance: boolean) => void;
  setNetworkStatus: (status: 'online' | 'offline') => void;
  setBuildInfo: (info: Record<string, any>) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  buildInformation: null,
  isMaintenanceMode: false,
  networkStatus: 'online',
  
  setMaintenanceMode: (isMaintenance) => set({ isMaintenanceMode: isMaintenance }),
  setNetworkStatus: (status) => set({ networkStatus: status }),
  setBuildInfo: (info) => set({ buildInformation: info }),
}));
