import { useEffect } from 'react';
import { useSocketContext } from '../providers/SocketProvider';
import { RoomManager } from '../rooms/roomManager';

export const useSocket = () => {
  const context = useSocketContext();
  return context.socket;
};

export const useConnection = () => {
  const { status, connect, disconnect } = useSocketContext();
  return { status, connect, disconnect };
};

export const useRoom = (roomId: string, role?: string) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !roomId) return;
    
    const manager = new RoomManager(socket);
    manager.joinRoom(roomId, role);

    return () => {
      manager.leaveRoom(roomId);
    };
  }, [socket, roomId, role]);
};

// Placeholder hooks for specific domain logic (Presence, Notifications, Monitoring, Exam)
export const useDomainEvents = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    
    // Example: socket.on('monitor:warning', (data) => alert(data.message));

    return () => {
      // socket.off('monitor:warning');
    };
  }, [socket]);
};
