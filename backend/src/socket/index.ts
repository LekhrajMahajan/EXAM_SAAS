import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "../config/env";
import { socketAuth } from "./socketAuth";
import { initializeLiveMonitoringSocket } from "./liveMonitoring.socket";

export let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Apply authentication middleware
  io.use(socketAuth);

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}, User: ${socket.data.user?.userId}`);

    // Initialize module-specific gateways
    initializeLiveMonitoringSocket(io, socket);

    socket.on("disconnect", (reason: string) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });

  return io;
};
