import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";

import { UserRole } from "../constants/roles";

import {
    initializeLiveMonitoringSocket,
} from "./liveMonitoring.socket";

export interface SocketUser {
    id: string;
    email: string;
    role: UserRole;
    companyId?: string;
    branchId?: string;
    centerId?: string;
}

declare module "socket.io" {
    interface Socket {
        user?: SocketUser;
    }
}

class LiveMonitoringGateway {
    private io!: Server;

    /*
    |--------------------------------------------------------------------------
    | Initialize
    |--------------------------------------------------------------------------
    */
    initialize(io: Server) {
        this.io = io;

        this.registerAuthentication();
        this.registerConnection();

        return this.io;
    }

    /*
    |--------------------------------------------------------------------------
    | Socket Instance
    |--------------------------------------------------------------------------
    */
    getIO() {
        if (!this.io) {
            throw new Error("Socket.IO is not initialized.");
        }
        return this.io;
    }

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */
    private registerAuthentication() {
        this.io.use(async (socket, next) => {
            try {
                const token =
                    socket.handshake.auth?.token ??
                    socket.handshake.headers.authorization;

                if (!token) {
                    return next(new Error("Authentication failed."));
                }

                const jwtToken =
                    token.startsWith("Bearer ")
                        ? token.substring(7)
                        : token;

                const decoded = jwt.verify(
                    jwtToken,
                    env.JWT_SECRET
                ) as JwtPayload;

                socket.user = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    companyId: decoded.companyId,
                    branchId: decoded.branchId,
                    centerId: decoded.centerId,
                };

                next();
            } catch (error) {
                next(new Error("Unauthorized socket."));
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    */
    private registerConnection() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`Socket Connected : ${socket.id}`);
            
            initializeLiveMonitoringSocket(this.io, socket);
            this.registerDisconnect(socket);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Join Room
    |--------------------------------------------------------------------------
    */
    joinRoom(socket: Socket, room: string) {
        socket.join(room);
        console.info(`[Socket] ${socket.id} joined ${room}`);
    }

    /*
    |--------------------------------------------------------------------------
    | Leave Room
    |--------------------------------------------------------------------------
    */
    leaveRoom(socket: Socket, room: string) {
        socket.leave(room);
        console.info(`[Socket] ${socket.id} left ${room}`);
    }

    /*
    |--------------------------------------------------------------------------
    | Emit To Socket
    |--------------------------------------------------------------------------
    */
    emitToSocket<T>(socketId: string, event: string, payload: T) {
        this.getIO().to(socketId).emit(event, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Emit To Room
    |--------------------------------------------------------------------------
    */
    emitToRoom<T>(room: string, event: string, payload: T) {
        this.getIO().to(room).emit(event, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Broadcast
    |--------------------------------------------------------------------------
    */
    broadcast<T>(event: string, payload: T) {
        this.getIO().emit(event, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Broadcast Except Sender
    |--------------------------------------------------------------------------
    */
    broadcastExceptSender<T>(socket: Socket, event: string, payload: T) {
        socket.broadcast.emit(event, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Observer Room
    |--------------------------------------------------------------------------
    */
    joinObserverRoom(socket: Socket, examId: string) {
        const room = `observer:${examId}`;
        socket.join(room);
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Room
    |--------------------------------------------------------------------------
    */
    joinAdminRoom(socket: Socket) {
        socket.join("admin");
    }


    /*
    |--------------------------------------------------------------------------
    | Disconnect
    |--------------------------------------------------------------------------
    */
    private registerDisconnect(socket: Socket) {
        socket.on("disconnect", (reason) => {
            console.info(`[Socket] ${socket.id} disconnected (${reason})`);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Connected Clients
    |--------------------------------------------------------------------------
    */
    getConnectedClientsCount(): number {
        return this.getIO().engine.clientsCount;
    }

    /*
    |--------------------------------------------------------------------------
    | Room Size
    |--------------------------------------------------------------------------
    */
    async getRoomSize(room: string): Promise<number> {
        const sockets = await this.getIO().in(room).fetchSockets();
        return sockets.length;
    }

    /*
    |--------------------------------------------------------------------------
    | Connected Socket Ids
    |--------------------------------------------------------------------------
    */
    async getRoomSockets(room: string): Promise<string[]> {
        const sockets = await this.getIO().in(room).fetchSockets();
        return sockets.map(socket => socket.id);
    }

    /*
    |--------------------------------------------------------------------------
    | Health Check
    |--------------------------------------------------------------------------
    */
    health() {
        return {
            initialized: !!this.io,
            connectedClients: this.getConnectedClientsCount(),
            transport: ["websocket", "polling"],
            uptime: process.uptime(),
            timestamp: new Date(),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Redis Adapter
    |--------------------------------------------------------------------------
    */
    async initializeRedisAdapter() {
        /*
        ---------------------------------------------------------
        Reserved for Redis Adapter

        const pubClient = createClient(...)
        const subClient = pubClient.duplicate()

        await Promise.all([
            pubClient.connect(),
            subClient.connect()
        ])

        this.io.adapter(
            createAdapter(
                pubClient,
                subClient
            )
        );
        ---------------------------------------------------------
        */
        console.info("[Socket] Redis adapter not configured.");
    }

    /*
    |--------------------------------------------------------------------------
    | Graceful Shutdown
    |--------------------------------------------------------------------------
    */
    shutdown() {
        if (!this.io) {
            return;
        }

        console.info("[Socket] Closing Socket.IO server...");
        this.io.disconnectSockets(true);

        this.io.close(() => {
            console.info("[Socket] Socket.IO server closed.");
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Socket
    |--------------------------------------------------------------------------
    */
    disconnectSocket(socketId: string) {
        const socket = this.getIO().sockets.sockets.get(socketId);
        if (socket) {
            socket.disconnect(true);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Emit System Alert
    |--------------------------------------------------------------------------
    */
    emitSystemAlert<T>(payload: T) {
        this.broadcast("system:alert", payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Emit Dashboard Update
    |--------------------------------------------------------------------------
    */
    emitDashboardUpdate<T>(examId: string, payload: T) {
        this.emitToRoom(
            `observer:${examId}`,
            "dashboard:update",
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Emit AI Alert
    |--------------------------------------------------------------------------
    */
    emitAIAlert<T>(examId: string, payload: T) {
        this.emitToRoom(
            `ai-proctor:${examId}`,
            "ai:alert",
            payload
        );
    }
}

export default new LiveMonitoringGateway();
