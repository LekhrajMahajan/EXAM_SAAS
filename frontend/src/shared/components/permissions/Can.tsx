import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface CanProps {
  permission?: string | null;
  anyPermission?: string[];
  allPermissions?: string[];
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Reusable <Can> wrapper component for granular element-level visibility control.
 * Evaluates dynamically against MongoDB-driven access rules and wildcards.
 *
 * Usage Examples:
 * <Can permission="branches.create"> <Button>Create Branch</Button> </Can>
 * <Can anyPermission={['exams.manage', 'exams.create']} fallback={<span>Read Only</span>}> ... </Can>
 */
export const Can: React.FC<CanProps> = ({
  permission,
  anyPermission,
  allPermissions,
  role,
  fallback = null,
  children,
}) => {
  const { can, canAny, canAll, hasRole } = usePermission();

  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  if (anyPermission && anyPermission.length > 0 && !canAny(anyPermission)) {
    return <>{fallback}</>;
  }

  if (allPermissions && allPermissions.length > 0 && !canAll(allPermissions)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Can;
