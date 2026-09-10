import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import jwt from "jsonwebtoken";

import { env } from "../../config/env";

import { registerSocketEvents } from "./websocket.events";

let io: Server;

/*
|--------------------------------------------------------------------------
| Initialize WebSocket
|--------------------------------------------------------------------------
*/

export const initializeWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,

      credentials: true,
    },

    transports: ["websocket", "polling"],
  });

  /*
    |--------------------------------------------------------------------------
    | Authentication Middleware
    |--------------------------------------------------------------------------
    */

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.replace(
          "Bearer ",

          "",
        );

      if (!token) {
        return next(new Error("Authentication token missing."));
      }

      const decoded = jwt.verify(
        token,

        env.JWT_SECRET,
      );

      socket.data.user = decoded;

      next();
    } catch {
      next(new Error("Unauthorized."));
    }
  });

  /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    */

  io.on(
    "connection",

    (socket) => {
      registerSocketEvents(
        io,

        socket,
      );
    },
  );

  return io;
};

/*
|--------------------------------------------------------------------------
| Get IO Instance
|--------------------------------------------------------------------------
*/

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

/*
|--------------------------------------------------------------------------
| Emit To Room
|--------------------------------------------------------------------------
*/

export const emitToRoom = (
  room: string,

  event: string,

  payload: unknown,
) => {
  getIO()
    .to(room)

    .emit(
      event,

      payload,
    );
};

/*
|--------------------------------------------------------------------------
| Emit To User
|--------------------------------------------------------------------------
*/

export const emitToUser = (
  socketId: string,

  event: string,

  payload: unknown,
) => {
  getIO()
    .to(socketId)

    .emit(
      event,

      payload,
    );
};

/*
|--------------------------------------------------------------------------
| Broadcast
|--------------------------------------------------------------------------
*/

export const broadcast = (
  event: string,

  payload: unknown,
) => {
  getIO().emit(
    event,

    payload,
  );
};
