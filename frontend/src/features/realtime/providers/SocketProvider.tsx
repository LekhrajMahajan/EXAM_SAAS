import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketClient } from '../client/socketClient';
import { useConnectionManager } from '../connection/connectionManager';
import { useAuthStore } from '@/stores/auth/auth.store';
import type { ConnectionStatus } from '../types/socket.types';

interface SocketContextValue {
  socket: Socket | null;
  status: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { status } = useConnectionManager(socket);
  const { isAuthenticated, accessToken } = useAuthStore();

  const connect = () => {
    if (isAuthenticated && accessToken) {
      const newSocket = socketClient.connect(accessToken);
      setSocket(newSocket);
    }
  };

  const disconnect = () => {
    socketClient.disconnect();
    setSocket(null);
  };

  // Auto connect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [isAuthenticated, accessToken]);

  return (
    <SocketContext.Provider value={{ socket, status, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
