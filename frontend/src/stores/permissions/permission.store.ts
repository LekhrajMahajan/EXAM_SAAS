import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PermissionState {
  roles: string[];
  permissions: string[];
  allowedModules: string[];
  allowedActions: Record<string, string[]>;
  
  setPermissions: (data: Partial<PermissionState>) => void;
  hasPermission: (permission: string) => boolean;
  canAccessModule: (module: string) => boolean;
  clearPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
  roles: [],
  permissions: [],
  allowedModules: [],
  allowedActions: {},
  
  setPermissions: (data) => set((state) => ({ ...state, ...data })),
  
  hasPermission: (permission) => get().permissions.includes(permission),
  canAccessModule: (module) => get().allowedModules.includes(module),
  
  clearPermissions: () => set({
    roles: [],
    permissions: [],
    allowedModules: [],
    allowedActions: {}
  }),
    }),
    {
      name: 'permission-storage', // name of the item in the storage (must be unique)
    }
  )
);
