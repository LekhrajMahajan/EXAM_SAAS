import React, { createContext, useContext, useEffect, useState } from 'react';
import { installManager } from '../install/installManager';
import { registerServiceWorker } from '../service-worker/registration';
import type { PWAState } from '../types/pwa.types';

const PWAContext = createContext<PWAState>({
  isInstalled: false,
  canInstall: false,
  isUpdateAvailable: false,
  isUpdating: false,
});

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false, // Detect via matchMedia('(display-mode: standalone)')
    canInstall: false,
    isUpdateAvailable: false,
    isUpdating: false,
  });

  useEffect(() => {
    installManager.initialize();
    registerServiceWorker();
    
    // Add logic here to sync Vite PWA update statuses into this React State
  }, []);

  return (
    <PWAContext.Provider value={state}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => useContext(PWAContext);
