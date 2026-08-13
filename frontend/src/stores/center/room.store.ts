import { create } from 'zustand';
import api from '@/services/api';

export interface Room {
  _id: string;
  roomName: string;
  roomCode: string;
  roomType: string;
  capacity: number;
  availableSeats: number;
  status: string;
}

interface RoomState {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  fetchRooms: (centerId?: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  isLoading: false,
  error: null,
  fetchRooms: async (centerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = centerId ? `/rooms?centerId=${centerId}` : '/rooms';
      const response = await api.get(url);
      if (response.data.success) {
        set({ rooms: Array.isArray(response.data.data) ? response.data.data : [], isLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch rooms', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch rooms', isLoading: false });
    }
  },
}));
