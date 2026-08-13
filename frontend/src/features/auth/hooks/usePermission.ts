import { useAuthStore } from '../store/useAuthStore';

export const usePermission = () => {
  const user = useAuthStore((state) => state.user);
  const storePermissions = useAuthStore((state) => state.permissions);

  const normalizeRole = (role?: string | null): string => {
    if (!role) return '';
    return String(role).toUpperCase().replace(/\s+/g, '_');
  };

  const checkSinglePermission = (perm: string, permsSet: Set<string>, isMaster: boolean, isCompanyAdmin: boolean): boolean => {
    if (isMaster || permsSet.has('*')) return true;
    const lower = perm.toLowerCase().trim();

    if (isCompanyAdmin && !lower.startsWith('master') && !lower.startsWith('system')) {
      return true;
    }

    if (permsSet.has(lower)) return true;

    const parts = lower.split('.');
    if (parts.length > 1 && permsSet.has(`${parts[0]}.*`)) {
      return true;
    }
    return false;
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user) return false;
    
    const roleNormalized = normalizeRole(user.role);
    const isMaster = roleNormalized === 'MASTER_ADMIN' || roleNormalized === 'SUPER_ADMIN';
    const isCompanyAdmin = roleNormalized === 'COMPANY_ADMIN';

    const allPerms = new Set([
      ...(user.permissions || []),
      ...(storePermissions || [])
    ].map(p => String(p).toLowerCase().trim()));

    if (isMaster || allPerms.has('*')) return true;

    if (Array.isArray(permission)) {
      if (permission.length === 0) return true;
      return permission.some(p => checkSinglePermission(p, allPerms, isMaster, isCompanyAdmin));
    }
    
    return checkSinglePermission(permission, allPerms, isMaster, isCompanyAdmin);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    const roleNormalized = normalizeRole(user.role);
    const isMaster = roleNormalized === 'MASTER_ADMIN' || roleNormalized === 'SUPER_ADMIN';
    const isCompanyAdmin = roleNormalized === 'COMPANY_ADMIN';

    const allPerms = new Set([
      ...(user.permissions || []),
      ...(storePermissions || [])
    ].map(p => String(p).toLowerCase().trim()));

    if (isMaster || allPerms.has('*')) return true;
    if (permissions.length === 0) return true;
    
    return permissions.every(p => checkSinglePermission(p, allPerms, isMaster, isCompanyAdmin));
  };

  return { 
    hasPermission, 
    hasAllPermissions, 
    permissions: Array.from(new Set([...(user?.permissions || []), ...(storePermissions || [])])) 
  };
};
