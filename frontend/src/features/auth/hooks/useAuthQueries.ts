import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/stores/auth/auth.store';

export const useCurrentUserQuery = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated, // Only run if token exists locally
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
