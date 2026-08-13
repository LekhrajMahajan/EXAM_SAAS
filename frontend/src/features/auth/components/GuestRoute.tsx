import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '@/stores/user/user.store';
import { tokenStorage } from '../storage/token.storage';

export const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profile = useUserStore((state) => state.profile);
  const hasToken = !!tokenStorage.getAccessToken();

  if (isAuthenticated && hasToken) {
    const role = profile?.roleId;
    if (role === 'MASTER_ADMIN') {
      return <Navigate to="/master-admin/dashboard" replace />;
    }
    if (role === 'COMPANY_ADMIN' || role === 'Company Admin') {
      return <Navigate to="/company/dashboard" replace />;
    }
    if (role === 'CANDIDATE' || role === 'Candidate') {
      return <Navigate to="/candidate/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
