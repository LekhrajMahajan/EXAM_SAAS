import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { env } from "../config/env";
import { JwtPayload } from "../middleware/authenticate";

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!authHeader) {
      return next(new Error("Authentication error: Access token missing"));
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    socket.data.user = decoded;

    next();
  } catch (error) {
    console.error("Socket Authentication Error:", error);
    next(new Error("Authentication error: Invalid or expired token"));
  }
};
