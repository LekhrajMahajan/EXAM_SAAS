import React from 'react';
import { useSessionTracker } from '../session/sessionTracker';
import { useTokenRefresh } from '../refresh/tokenRefresh';

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize passive background tracking
  useSessionTracker();
  useTokenRefresh();

  return <>{children}</>;
};
