export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface RoomMetadata {
  roomId: string;
  type: 'exam' | 'center' | 'global' | 'candidate';
  joinedAt: number;
}

export interface SocketState {
  status: ConnectionStatus;
  activeRooms: Record<string, RoomMetadata>;
  latency: number;
  lastHeartbeat: number | null;
}
