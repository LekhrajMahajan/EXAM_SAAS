import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../types';

export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  const hasRole = (role: Role | Role[]) => {
    if (!user) return false;
    
    // Master Admin has access to everything
    if (user.role === 'Master Admin') return true;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return { hasRole, role: user?.role };
};
