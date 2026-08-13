// src/socket/socket.client.ts
// Socket.IO client factory with auth token injection.
import { io, type Socket } from 'socket.io-client'
import { env, APP_CONSTANTS } from '@/config'
import { storage } from '@/utils'

let socket: Socket | null = null

export const createSocket = (): Socket => {
  if (socket?.connected) return socket

  const token = storage.get<string>(APP_CONSTANTS.TOKEN_KEY)

  socket = io(env.socket.url, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })

  socket.on('connect', () => {
    if (env.isDev) console.warn('[Socket] Connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    if (env.isDev) console.warn('[Socket] Disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message)
  })

  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (): void => {
  socket?.disconnect()
  socket = null
}
