import { useAuthStore } from '@/stores/auth/auth.store';
import { useUserStore } from '@/stores/user/user.store';
import { usePermissionStore } from '@/stores/permissions/permission.store';

export const useAuth = () => {
  const { isAuthenticated, status } = useAuthStore();
  const { profile } = useUserStore();
  
  return { isAuthenticated, status, user: profile };
};

export const usePermissions = () => {
  const permissions = usePermissionStore();
  return permissions;
};

export * from './useAuthMutations';
export * from './useAuthQueries';
