import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../utils/constants';
import type { ConnectionStatus } from '../types/socket.types';

export const useConnectionManager = (socket: Socket | null) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onConnectError = () => setStatus('reconnecting'); // Triggers auto-reconnect cycle

    socket.on(SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectError);

    // Initial state check
    if (socket.connected) {
      setStatus('connected');
    } else if (socket.active) {
      setStatus('connecting');
    }

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
    };
  }, [socket]);

  return { status };
};
