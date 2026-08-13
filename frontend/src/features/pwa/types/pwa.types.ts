export type NetworkStatus = 'online' | 'offline' | 'weak';

export interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isUpdateAvailable: boolean;
  isUpdating: boolean;
}

export interface SyncPayload {
  id: string;
  type: 'mutation' | 'socket' | 'analytics';
  endpoint?: string;
  data: any;
  timestamp: number;
  retryCount: number;
}
