import { usePermissionStore } from '@/stores/permissions/permission.store';

export const hasRole = (role: string): boolean => {
  const roles = usePermissionStore.getState().roles;
  const normalizedRoles = roles.map(r => r === 'MASTER_ADMIN' ? 'Master Admin' : r);
  const targetRole = role === 'MASTER_ADMIN' ? 'Master Admin' : role;
  return normalizedRoles.includes(targetRole) || normalizedRoles.includes('Master Admin');
};

export const hasPermission = (permission: string): boolean => {
  const permissions = usePermissionStore.getState().permissions;
  return permissions.includes(permission) || hasRole('Master Admin');
};

export const hasAnyPermission = (permissions: string[]): boolean => {
  if (hasRole('Master Admin')) return true;
  const userPermissions = usePermissionStore.getState().permissions;
  return permissions.some(p => userPermissions.includes(p));
};

export const hasAllPermissions = (permissions: string[]): boolean => {
  if (hasRole('Master Admin')) return true;
  const userPermissions = usePermissionStore.getState().permissions;
  return permissions.every(p => userPermissions.includes(p));
};

export const canAccessModule = (module: string): boolean => {
  if (hasRole('Master Admin')) return true;
  return usePermissionStore.getState().allowedModules.includes(module);
};

export const canPerformAction = (module: string, action: string): boolean => {
  if (hasRole('Master Admin')) return true;
  const allowedActions = usePermissionStore.getState().allowedActions;
  return allowedActions[module]?.includes(action) || false;
};
