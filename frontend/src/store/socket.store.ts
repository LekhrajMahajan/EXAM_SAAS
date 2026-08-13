// src/store/socket.store.ts — WebSocket connection state
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface SocketState {
  status: SocketStatus
  socketId: string | null
  lastError: string | null
  reconnectAttempts: number

  setStatus: (status: SocketStatus) => void
  setSocketId: (id: string | null) => void
  setError: (error: string | null) => void
  incrementReconnect: () => void
  resetReconnect: () => void
}

export const useSocketStore = create<SocketState>()(
  devtools(
    immer((set) => ({
      status: 'disconnected',
      socketId: null,
      lastError: null,
      reconnectAttempts: 0,

      setStatus: (status) =>
        set((s) => {
          s.status = status
        }),

      setSocketId: (id) =>
        set((s) => {
          s.socketId = id
        }),

      setError: (error) =>
        set((s) => {
          s.lastError = error
        }),

      incrementReconnect: () =>
        set((s) => {
          s.reconnectAttempts += 1
        }),

      resetReconnect: () =>
        set((s) => {
          s.reconnectAttempts = 0
        }),
    })),
    { name: 'SocketStore' },
  ),
)
