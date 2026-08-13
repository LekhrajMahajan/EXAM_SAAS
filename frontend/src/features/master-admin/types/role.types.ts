// frontend types mirroring backend role.types.ts

export type RoleStatus = 'ACTIVE' | 'INACTIVE';

export type RoleCategory = 'PLATFORM' | 'COMPANY' | 'OPERATIONAL' | 'CANDIDATE' | 'CUSTOM';

export interface Role {
  _id: string;
  companyId?: string | null;
  name: string;
  displayName: string;
  roleName?: string;
  roleCode: string;
  roleType?: string;
  category?: RoleCategory | string;
  parentRole?: string | null;
  hierarchyLevel: number;
  priority?: number;
  color?: string;
  icon?: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  systemRole?: boolean;
  defaultRole?: boolean;
  isCustom?: boolean;
  clonedFrom?: string | null;
  status: RoleStatus;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleStatistics {
  total: number;
  active: number;
  inactive: number;
  systemRoles: number;
  customRoles: number;
}
