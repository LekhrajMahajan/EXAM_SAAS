import { Server, Socket } from "socket.io";

import { websocketService } from "./websocket.service";

import { SocketEvent } from "./websocket.types";

export const registerSocketEvents = (
  io: Server,

  socket: Socket,
) => {
  /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    */

  console.log(`Socket Connected : ${socket.id}`);

  /*
    |--------------------------------------------------------------------------
    | Join Room
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.JOIN_ROOM,

    async (payload) => {
      await websocketService.joinRoom(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Leave Room
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.LEAVE_ROOM,

    async (payload) => {
      await websocketService.leaveRoom(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Heartbeat
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.HEARTBEAT,

    async (payload) => {
      await websocketService.heartbeat(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Answer Saved
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.ANSWER_SAVED,

    async (payload) => {
      await websocketService.answerSaved(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Live Monitoring
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.LIVE_MONITORING,

    async (payload) => {
      await websocketService.liveMonitoring(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Tab Switch
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.TAB_SWITCH,

    async (payload) => {
      await websocketService.tabSwitch(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Fullscreen Exit
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.FULLSCREEN_EXIT,

    async (payload) => {
      await websocketService.fullscreenExit(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Face Detected
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.FACE_DETECTED,

    async (payload) => {
      await websocketService.faceDetected(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Face Not Found
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.FACE_NOT_FOUND,

    async (payload) => {
      await websocketService.faceNotFound(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Multiple Face
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.MULTIPLE_FACE,

    async (payload) => {
      await websocketService.multipleFace(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Network Offline
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.NETWORK_OFFLINE,

    async (payload) => {
      await websocketService.networkOffline(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Network Online
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.NETWORK_ONLINE,

    async (payload) => {
      await websocketService.networkOnline(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Copy Paste
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.COPY_PASTE,

    async (payload) => {
      await websocketService.copyPaste(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Screen Recording
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.SCREEN_RECORDING,

    async (payload) => {
      await websocketService.screenRecording(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Auto Submit
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.AUTO_SUBMIT,

    async (payload) => {
      await websocketService.autoSubmit(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Chat Message
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.CHAT_MESSAGE,

    async (payload) => {
      await websocketService.chatMessage(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Notification
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.NOTIFICATION,

    async (payload) => {
      await websocketService.notification(
        socket,

        payload,
      );
    },
  );

  /*
    |--------------------------------------------------------------------------
    | Disconnect
    |--------------------------------------------------------------------------
    */

  socket.on(
    SocketEvent.DISCONNECT,

    async () => {
      await websocketService.disconnect(socket);
    },
  );
};
