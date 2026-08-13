import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../utils/constants';

export class RoomManager {
  constructor(private socket: Socket) {}

  public joinRoom(roomId: string, role?: string) {
    if (!this.socket.connected) return;
    this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, role });
  }

  public leaveRoom(roomId: string) {
    if (!this.socket.connected) return;
    this.socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId });
  }

  public switchRoom(oldRoomId: string, newRoomId: string) {
    this.leaveRoom(oldRoomId);
    this.joinRoom(newRoomId);
  }
}
