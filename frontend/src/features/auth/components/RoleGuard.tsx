import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { usePermissionStore } from '@/stores/permissions/permission.store';

interface RoleGuardProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, status } = useAuth();
  const roles = usePermissionStore((state) => state.roles);

  if (status === 'loading') {
    return <div>Verifying roles...</div>; // Could use a LoadingStates component
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const normalizedRoles = (roles || []).map(r => {
    if (r === 'MASTER_ADMIN') return 'Master Admin';
    if (r === 'COMPANY_ADMIN') return 'Company Admin';
    return r;
  });

  const isAuthorized = allowedRoles.some((role) => {
    const targetRole = role === 'MASTER_ADMIN' ? 'Master Admin' : 
                       role === 'COMPANY_ADMIN' ? 'Company Admin' : role;
    return normalizedRoles.includes(targetRole) || normalizedRoles.includes('Master Admin');
  });

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  requiredPermissions: string[];
  children?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ requiredPermissions, children }) => {
  const { isAuthenticated, status } = useAuth();
  const userPermissions = usePermissionStore((state) => state.permissions);
  const roles = usePermissionStore((state) => state.roles);

  if (status === 'loading') return <div>Verifying permissions...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  const normalizedRoles = (roles || []).map(r => r === 'MASTER_ADMIN' ? 'Master Admin' : r);
  const isMasterAdmin = normalizedRoles.includes('Master Admin');

  const isAuthorized = isMasterAdmin || requiredPermissions.every((perm) => (userPermissions || []).includes(perm));

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
