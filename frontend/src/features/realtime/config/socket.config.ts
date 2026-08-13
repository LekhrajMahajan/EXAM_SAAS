export interface SocketConfig {
  url: string;
  options: {
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    reconnectionDelayMax: number;
    timeout: number;
    autoConnect: boolean;
  };
}

export const socketConfig: SocketConfig = {
  url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  options: {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: false, // We connect manually when Auth is ready
  },
};
