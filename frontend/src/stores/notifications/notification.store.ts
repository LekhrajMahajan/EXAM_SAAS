import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  isDrawerOpen: boolean;
  toastQueue: any[]; // Placeholder for actual toast type
  
  incrementUnread: () => void;
  clearUnread: () => void;
  toggleDrawer: () => void;
  addToast: (toast: any) => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount: 0,
  isDrawerOpen: false,
  toastQueue: [],
  
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  
  addToast: (toast) => set((state) => ({ 
    toastQueue: [...state.toastQueue, toast] 
  })),
  removeToast: (id) => set((state) => ({
    toastQueue: state.toastQueue.filter(t => t.id !== id)
  })),
}));
