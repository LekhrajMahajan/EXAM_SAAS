import { Socket } from "socket.io";
import { SocketEvent, ISocketPayload } from "./websocket.types";

class WebSocketService {
  /*
  |--------------------------------------------------------------------------
  | Join Room
  |--------------------------------------------------------------------------
  */
  async joinRoom(socket: Socket, payload: ISocketPayload) {
    if (!payload.room) {
      return;
    }
    await socket.join(payload.room);
    socket.emit(SocketEvent.JOIN_ROOM, {
      success: true,
      room: payload.room,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Leave Room
  |--------------------------------------------------------------------------
  */
  async leaveRoom(socket: Socket, payload: ISocketPayload) {
    if (!payload.room) {
      return;
    }
    await socket.leave(payload.room);
    socket.emit(SocketEvent.LEAVE_ROOM, {
      success: true,
      room: payload.room,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Heartbeat
  |--------------------------------------------------------------------------
  */
  async heartbeat(socket: Socket, payload: ISocketPayload) {
    socket.emit(SocketEvent.HEARTBEAT, {
      serverTime: new Date(),
      data: payload.data,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Answer Saved
  |--------------------------------------------------------------------------
  */
  async answerSaved(socket: Socket, payload: ISocketPayload) {
    /*
    |--------------------------------------------------------------------------
    | TODO
    |--------------------------------------------------------------------------
    |
    | Save Candidate Answer
    | Update Progress
    | Notify Observer
    |
    */
    socket.emit(SocketEvent.ANSWER_SAVED, {
      success: true,
      data: payload.data,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Live Monitoring
  |--------------------------------------------------------------------------
  */
  async liveMonitoring(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.LIVE_MONITORING, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Tab Switch
  |--------------------------------------------------------------------------
  */
  async tabSwitch(socket: Socket, payload: ISocketPayload) {
    /*
    |--------------------------------------------------------------------------
    | TODO
    |--------------------------------------------------------------------------
    |
    | Increase Violation Count
    | Save Activity Log
    | Notify Observer
    |
    */
    socket.broadcast.emit(SocketEvent.TAB_SWITCH, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Fullscreen Exit
  |--------------------------------------------------------------------------
  */
  async fullscreenExit(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.FULLSCREEN_EXIT, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Face Detected
  |--------------------------------------------------------------------------
  */
  async faceDetected(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.FACE_DETECTED, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Face Not Found
  |--------------------------------------------------------------------------
  */
  async faceNotFound(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.FACE_NOT_FOUND, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Multiple Face
  |--------------------------------------------------------------------------
  */
  async multipleFace(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.MULTIPLE_FACE, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Network Offline
  |--------------------------------------------------------------------------
  */
  async networkOffline(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.NETWORK_OFFLINE, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Network Online
  |--------------------------------------------------------------------------
  */
  async networkOnline(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.NETWORK_ONLINE, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Copy Paste
  |--------------------------------------------------------------------------
  */
  async copyPaste(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.COPY_PASTE, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Screen Recording
  |--------------------------------------------------------------------------
  */
  async screenRecording(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.SCREEN_RECORDING, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Auto Submit
  |--------------------------------------------------------------------------
  */
  async autoSubmit(socket: Socket, payload: ISocketPayload) {
    /*
    |--------------------------------------------------------------------------
    | TODO
    |--------------------------------------------------------------------------
    |
    | Submit Candidate Exam
    | Lock Session
    | Notify Observer
    |
    */
    socket.broadcast.emit(SocketEvent.AUTO_SUBMIT, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Chat Message
  |--------------------------------------------------------------------------
  */
  async chatMessage(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.CHAT_MESSAGE, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Notification
  |--------------------------------------------------------------------------
  */
  async notification(socket: Socket, payload: ISocketPayload) {
    socket.broadcast.emit(SocketEvent.NOTIFICATION, payload.data);
  }

  /*
  |--------------------------------------------------------------------------
  | Disconnect
  |--------------------------------------------------------------------------
  */
  async disconnect(socket: Socket) {
    console.log(`Socket Disconnected : ${socket.id}`);
  }
}

export const websocketService = new WebSocketService();
