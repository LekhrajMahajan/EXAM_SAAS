import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '@/stores/user/user.store';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profile = useUserStore((state) => state.profile);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const isBranchManager =
    profile?.roleId === 'BRANCH_MANAGER' ||
    profile?.roleId === 'Branch Manager' ||
    profile?.role === 'BRANCH_MANAGER' ||
    profile?.role === 'Branch Manager';

  const isCenterManager =
    profile?.roleId === 'CENTER_MANAGER' ||
    profile?.roleId === 'Center Manager' ||
    profile?.role === 'CENTER_MANAGER' ||
    profile?.role === 'Center Manager';

  // Enforce completion of the mandatory Branch Setup Wizard before dashboard access
  if (
    isBranchManager &&
    profile?.branchSetupStatus &&
    profile?.branchSetupStatus !== 'ACTIVE' &&
    !location.pathname.startsWith('/branch/onboarding-wizard') &&
    !location.pathname.startsWith('/auth')
  ) {
    return <Navigate to="/branch/onboarding-wizard" replace />;
  }

  // Enforce completion of the mandatory 8-step Center Setup Wizard before operational access
  if (
    isCenterManager &&
    !profile?.forcePasswordChange &&
    profile?.centerSetupStatus &&
    profile?.centerSetupStatus !== 'ACTIVE' &&
    !location.pathname.startsWith('/center/onboarding-wizard') &&
    !location.pathname.startsWith('/auth')
  ) {
    return <Navigate to="/center/onboarding-wizard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
