// src/store/notification.store.ts — in-app notification queue
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  read: boolean
  createdAt: string
  href?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number

  add: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    immer((set) => ({
      notifications: [],
      unreadCount: 0,

      add: (n) =>
        set((s) => {
          const entry: Notification = {
            ...n,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date().toISOString(),
          }
          s.notifications.unshift(entry)
          s.unreadCount += 1
        }),

      markRead: (id) =>
        set((s) => {
          const item = s.notifications.find((x) => x.id === id)
          if (item && !item.read) {
            item.read = true
            s.unreadCount = Math.max(0, s.unreadCount - 1)
          }
        }),

      markAllRead: () =>
        set((s) => {
          s.notifications.forEach((x) => {
            x.read = true
          })
          s.unreadCount = 0
        }),

      remove: (id) =>
        set((s) => {
          const idx = s.notifications.findIndex((x) => x.id === id)
          if (idx !== -1) {
            if (!s.notifications[idx].read) {
              s.unreadCount = Math.max(0, s.unreadCount - 1)
            }
            s.notifications.splice(idx, 1)
          }
        }),

      clear: () =>
        set((s) => {
          s.notifications = []
          s.unreadCount = 0
        }),
    })),
    { name: 'NotificationStore' },
  ),
)
