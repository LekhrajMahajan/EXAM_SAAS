import React, { createContext, useContext, useEffect, useState } from 'react';
import { NetworkManager } from '../network/networkManager';
import type { NetworkStatus } from '../types/pwa.types';

const NetworkContext = createContext<NetworkStatus>('online');

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<NetworkStatus>(NetworkManager.getStatus());

  useEffect(() => {
    NetworkManager.initialize();
    NetworkManager.subscribe(setStatus);
    return () => {}; // return void cleanup
  }, []);

  return (
    <NetworkContext.Provider value={status}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
