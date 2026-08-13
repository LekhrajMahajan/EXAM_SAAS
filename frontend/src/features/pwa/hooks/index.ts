export { useNetwork } from '../providers/NetworkProvider';
export { usePWA } from '../providers/PWAProvider';

import { installManager } from '../install/installManager';
import { SyncManager } from '../sync/syncManager';

export const useInstallPrompt = () => {
  return { promptInstall: () => installManager.promptInstall() };
};

export const useSync = () => {
  return { 
    queueMutation: SyncManager.queueMutation,
    flushQueue: SyncManager.flushQueue
  };
};
