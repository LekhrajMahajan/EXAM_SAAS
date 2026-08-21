import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export function useLiveCenters(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['live-centers', params],
    queryFn: async () => {
      const response = await api.get('/live-monitoring/centers', { params });
      return response.data;
    },
  });
}
