import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';

interface PermissionGuardProps {
  children: ReactNode;
  permissions: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ 
  children, 
  permissions, 
  requireAll = false,
  fallback 
}: PermissionGuardProps) => {
  const { hasPermission, hasAllPermissions } = usePermission();

  const isAllowed = requireAll && Array.isArray(permissions)
    ? hasAllPermissions(permissions)
    : hasPermission(permissions);

  if (!isAllowed) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
