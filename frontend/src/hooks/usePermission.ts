import { useAuthStore } from "../features/auth/store/useAuthStore";

export function usePermission() {
  const { user, permissions = [] } = useAuthStore();
  const roleStr = user?.role ? String(user.role).toUpperCase() : "";

  const isMasterAdmin = roleStr === "MASTER_ADMIN" || roleStr === "MASTER ADMIN";
  const isCompanyAdmin = roleStr === "COMPANY_ADMIN" || roleStr === "COMPANY ADMIN";

  /**
   * Checks if the authenticated user possesses a given permission key.
   * Master Admin and Company Admin or wildcard '*' automatically satisfy the check.
   */
  const can = (permissionKey?: string | null): boolean => {
    if (!permissionKey) return true;
    if (isMasterAdmin || isCompanyAdmin) return true;
    if (permissions.includes("*")) return true;

    const key = permissionKey.toLowerCase();
    const modWild = key.split(".")[0] + ".*";

    return permissions.some(
      (p) => p.toLowerCase() === key || p.toLowerCase() === modWild || p === "*"
    );
  };

  /**
   * Checks if user possesses AT LEAST ONE of the required permissions.
   */
  const canAny = (permissionKeys: string[] = []): boolean => {
    if (permissionKeys.length === 0) return true;
    return permissionKeys.some((k) => can(k));
  };

  /**
   * Checks if user possesses ALL of the specified permissions.
   */
  const canAll = (permissionKeys: string[] = []): boolean => {
    if (permissionKeys.length === 0) return true;
    return permissionKeys.every((k) => can(k));
  };

  /**
   * Checks role level hierarchy match.
   */
  const hasRole = (roles: string | string[]): boolean => {
    if (!user?.role) return false;
    if (isMasterAdmin) return true; // Master admin encompasses all operational roles
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    return requiredRoles.some((r) => r.toUpperCase() === roleStr);
  };

  return {
    can,
    canAny,
    canAll,
    hasRole,
    user,
    permissions,
    isMasterAdmin,
    isCompanyAdmin,
  };
}
