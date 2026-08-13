import { io, Socket } from 'socket.io-client';
import { socketConfig } from '../config/socket.config';

class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket) {
      // Update token if socket exists but disconnected
      this.socket.auth = { token };
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(socketConfig.url, {
      ...socketConfig.options,
      auth: { token }
    });

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = SocketClient.getInstance();
