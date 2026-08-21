import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { MeritRecord, MeritStatistics } from '../types';

interface MeritListResponse {
  data: MeritRecord[];
  total: number;
}

export function useMeritLists(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['merit-lists', params],
    queryFn: async () => {
      const response = await api.get<MeritListResponse>('/merit-list', { params });
      return response.data;
    },
  });
}
