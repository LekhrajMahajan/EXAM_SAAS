import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export function useViolations(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['live-violations', params],
    queryFn: async () => {
      const response = await api.get('/live-monitoring/violations', { params });
      return response.data;
    },
  });
}
