import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { usePermissionStore } from '@/stores/permissions/permission.store';

/**
 * Enterprise real-time RBAC Hook for components, buttons, and layouts.
 * Evaluates active user tokens, assigned operational roles, module prefixes (e.g. exams.*),
 * and wildcard grants against requested access requirements.
 */
export function usePermission(required: string | string[]) {
  const authUser = useAuthStore((state) => state.user);
  const authPermissions = useAuthStore((state) => state.permissions);
  const storePermissions = usePermissionStore((state) => state.permissions);
  const storeRoles = usePermissionStore((state) => state.roles);

  if (!authUser && storePermissions.length === 0) {
    return { hasPermission: false, isMasterAdmin: false, isCompanyAdmin: false };
  }

  const roleNormalized = authUser?.role ? String(authUser.role).toUpperCase().replace(/\s+/g, '_') : '';
  const isMasterAdmin = roleNormalized === 'MASTER_ADMIN' || roleNormalized === 'SUPER_ADMIN' || storeRoles.includes('MASTER_ADMIN');
  const isCompanyAdmin = roleNormalized === 'COMPANY_ADMIN' || storeRoles.includes('COMPANY_ADMIN');

  // Master Admin possesses universal authorization across all tenants and features
  if (isMasterAdmin) {
    return { hasPermission: true, isMasterAdmin, isCompanyAdmin };
  }

  const combinedPerms = new Set([
    ...(authPermissions || []),
    ...(authUser?.permissions || []),
    ...(storePermissions || [])
  ].map((p) => String(p).toLowerCase().trim()));

  // Universal wildcard grant
  if (combinedPerms.has('*')) {
    return { hasPermission: true, isMasterAdmin, isCompanyAdmin };
  }

  const reqArray = Array.isArray(required) ? required : [required];
  if (reqArray.length === 0) {
    return { hasPermission: true, isMasterAdmin, isCompanyAdmin };
  }

  // Evaluate whether user matches any requested role or fine-grained permission string
  const hasAccess = reqArray.some((reqItem) => {
    const reqNorm = String(reqItem).trim().toUpperCase().replace(/\s+/g, '_');
    const reqLower = String(reqItem).trim().toLowerCase();

    // Check direct role match
    if (reqNorm === roleNormalized || storeRoles.map((r) => r.toUpperCase()).includes(reqNorm)) {
      return true;
    }

    // Company Admin possesses all company-scoped operational capabilities by default
    if (isCompanyAdmin && !reqLower.startsWith('master') && !reqLower.startsWith('system')) {
      return true;
    }

    // Exact permission key match
    if (combinedPerms.has(reqLower)) {
      return true;
    }

    // Module prefix wildcard match (e.g. 'exams.*' granting 'exams.create')
    const parts = reqLower.split('.');
    if (parts.length > 1 && combinedPerms.has(`${parts[0]}.*`)) {
      return true;
    }

    return false;
  });

  return { hasPermission: hasAccess, isMasterAdmin, isCompanyAdmin };
}
