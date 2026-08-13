import api from '@/services/api';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { Permission, PermissionStatistics, PermissionModule, PermissionAction, PermissionGroup, PermissionCategory } from '../types/permission.types';

const BASE_PATH = '/permissions';

export interface PermissionSearchParams extends PaginationParams {
  status?: string;
  companyId?: string;
  module?: PermissionModule | string;
  group?: PermissionGroup | string;
  action?: PermissionAction | string;
  resource?: string;
  category?: PermissionCategory | string;
  keyword?: string;
  search?: string;
  isSystem?: boolean;
  isSystemPermission?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePermissionPayload {
  name?: string;
  permissionKey?: string;
  displayName: string;
  module: PermissionModule | string;
  group?: PermissionGroup | string;
  action: PermissionAction | string;
  resource?: string;
  category?: PermissionCategory | string;
  description?: string;
  apiEndpoint?: string;
  httpMethod?: string;
  frontendRoute?: string;
  icon?: string;
  sortOrder?: number;
  companyId?: string;
  isSystemPermission?: boolean;
  isVisible?: boolean;
}

export type UpdatePermissionPayload = Partial<CreatePermissionPayload>;

export interface PermissionMatrixResponse {
  roles: Array<Record<string, unknown>>;
  permissions: Array<Permission & { isLockedBySubscription?: boolean; lockedReason?: string }>;
  matrix: Record<string, Record<string, boolean>>;
  generatedAt?: string;
}

export const permissionApi = {
  getPermissions: async (params?: PermissionSearchParams): Promise<PaginatedResponse<Permission>> => {
    const { data } = await api.get<PaginatedResponse<Permission>>(BASE_PATH, { params });
    return data;
  },

  searchPermissions: async (params?: PermissionSearchParams): Promise<PaginatedResponse<Permission>> => {
    const { data } = await api.get<PaginatedResponse<Permission>>(`${BASE_PATH}/search`, { params });
    return data;
  },

  getPermissionsByGroup: async (group: string, companyId?: string): Promise<ApiResponse<Permission[]>> => {
    const { data } = await api.get<ApiResponse<Permission[]>>(`${BASE_PATH}/group/${group}`, { params: { companyId } });
    return data;
  },

  getPermissionsByModule: async (moduleName: string, companyId?: string): Promise<ApiResponse<Permission[]>> => {
    const { data } = await api.get<ApiResponse<Permission[]>>(`${BASE_PATH}/module/${moduleName}`, { params: { companyId } });
    return data;
  },

  getPermissionById: async (id: string): Promise<ApiResponse<Permission>> => {
    const { data } = await api.get<ApiResponse<Permission>>(`${BASE_PATH}/${id}`);
    return data;
  },

  createPermission: async (payload: CreatePermissionPayload): Promise<ApiResponse<Permission>> => {
    const { data } = await api.post<ApiResponse<Permission>>(BASE_PATH, payload);
    return data;
  },

  updatePermission: async (id: string, payload: UpdatePermissionPayload): Promise<ApiResponse<Permission>> => {
    const { data } = await api.patch<ApiResponse<Permission>>(`${BASE_PATH}/${id}`, payload);
    return data;
  },

  deletePermission: async (id: string): Promise<ApiResponse<Permission>> => {
    const { data } = await api.delete<ApiResponse<Permission>>(`${BASE_PATH}/${id}`);
    return data;
  },

  restorePermission: async (id: string): Promise<ApiResponse<Permission>> => {
    const { data } = await api.patch<ApiResponse<Permission>>(`${BASE_PATH}/${id}/restore`);
    return data;
  },

  updatePermissionStatus: async (id: string, status: string): Promise<ApiResponse<Permission>> => {
    const { data } = await api.patch<ApiResponse<Permission>>(`${BASE_PATH}/${id}/status`, { status });
    return data;
  },

  getPermissionStatistics: async (): Promise<ApiResponse<PermissionStatistics>> => {
    const { data } = await api.get<ApiResponse<PermissionStatistics>>(`${BASE_PATH}/statistics`);
    return data;
  },

  getPermissionMatrix: async (companyId?: string): Promise<ApiResponse<PermissionMatrixResponse>> => {
    const { data } = await api.get<ApiResponse<PermissionMatrixResponse>>(`${BASE_PATH}/matrix`, { params: { companyId } });
    return data;
  },
};
