import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks';
import { tokenStorage } from '../storage/token.storage';

export const ProtectedRoute = () => {
  const { isAuthenticated, status, user } = useAuth();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <div>Loading session...</div>;
  }

  if (!isAuthenticated || !tokenStorage.getAccessToken()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // If company admin has pending payment, force redirect to subscription page
  if (
    user?.roleId === 'COMPANY_ADMIN' &&
    user?.paymentStatus !== 'SUCCESS' &&
    !location.pathname.startsWith('/company/subscription')
  ) {
    return <Navigate to="/company/subscription" replace />;
  }

  const roleStr = String(user?.role || '');

  const isCenterManager =
    user?.roleId === 'CENTER_MANAGER' ||
    user?.roleId === 'Center Manager' ||
    roleStr === 'CENTER_MANAGER' ||
    roleStr === 'Center Manager';
  if (
    isCenterManager &&
    !user?.forcePasswordChange &&
    user?.centerSetupStatus &&
    user?.centerSetupStatus !== 'ACTIVE' &&
    !location.pathname.startsWith('/center/onboarding-wizard') &&
    !location.pathname.startsWith('/auth')
  ) {
    return <Navigate to="/center/onboarding-wizard" replace />;
  }

  // Prevent accessing onboarding wizard if already ACTIVE
  if (
    isCenterManager &&
    user?.centerSetupStatus === 'ACTIVE' &&
    location.pathname.startsWith('/center/onboarding-wizard')
  ) {
    return <Navigate to="/dashboard/center-manager" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && !!tokenStorage.getAccessToken()) {
    const stateObj = location.state as { from?: { pathname?: string } } | null;
    const origin = stateObj?.from?.pathname || '/dashboard';
    return <Navigate to={origin} replace />;
  }

  return <Outlet />;
};
