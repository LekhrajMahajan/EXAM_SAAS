import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { usePermission } from "@/hooks/usePermission";
import { ForbiddenState, UnauthorizedState } from "./PermissionComponents";

interface ProtectedRouteProps {
  requirePermission?: string;
  requireAnyPermission?: string[];
  requireAllPermissions?: string[];
  requireRole?: string | string[];
  fallbackPath?: string;
  children: React.ReactNode;
}

/**
 * Enterprise RouteGuard and ProtectedRoute component for guarding React Router URLs.
 * Automatically blocks unauthorized visits with elegant 403 Forbidden / Unauthorized fallbacks.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  fallbackPath,
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { can, canAny, canAll, hasRole } = usePermission();

  if (!isAuthenticated) {
    return (
      <UnauthorizedState
        onLogin={() => {
          window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
        }}
      />
    );
  }

  if (requirePermission && !can(requirePermission)) {
    if (fallbackPath) return <Navigate to={fallbackPath} replace />;
    return <ForbiddenState onBack={() => window.history.back()} />;
  }

  if (requireAnyPermission && requireAnyPermission.length > 0 && !canAny(requireAnyPermission)) {
    if (fallbackPath) return <Navigate to={fallbackPath} replace />;
    return <ForbiddenState onBack={() => window.history.back()} />;
  }

  if (requireAllPermissions && requireAllPermissions.length > 0 && !canAll(requireAllPermissions)) {
    if (fallbackPath) return <Navigate to={fallbackPath} replace />;
    return <ForbiddenState onBack={() => window.history.back()} />;
  }

  if (requireRole && !hasRole(requireRole)) {
    if (fallbackPath) return <Navigate to={fallbackPath} replace />;
    return <ForbiddenState onBack={() => window.history.back()} />;
  }

  return <>{children}</>;
};

export const RouteGuard = ProtectedRoute;
export default ProtectedRoute;
