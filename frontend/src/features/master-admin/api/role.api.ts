import api from '@/services/api';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { Role, RoleStatistics } from '../types/role.types';

const BASE_PATH = '/roles';

export interface RoleSearchParams extends PaginationParams {
  status?: string;
  companyId?: string;
  isSystem?: boolean;
  roleType?: string;
  category?: string;
  defaultRole?: boolean;
}

export interface CreateRolePayload {
  name: string;
  displayName: string;
  roleName?: string;
  roleCode: string;
  roleType?: string;
  category?: string;
  parentRole?: string | null;
  hierarchyLevel?: number;
  priority?: number;
  color?: string;
  icon?: string;
  description?: string;
  permissions?: string[];
  companyId?: string;
  isSystem?: boolean;
  systemRole?: boolean;
  defaultRole?: boolean;
  isCustom?: boolean;
  status?: string;
}

export type UpdateRolePayload = Partial<CreateRolePayload>;

export const roleApi = {
  getRoles: async (params?: RoleSearchParams): Promise<PaginatedResponse<Role>> => {
    const { data } = await api.get<PaginatedResponse<Role> & { data?: { data?: Role[]; page: number; limit: number; total: number; totalPages: number } }>(BASE_PATH, { params });
    
    // Transform backend { data: { data: [], total... } } to frontend PaginatedResponse
    if (data.data && 'data' in data.data && data.data.data) {
      const pData = data.data;
      return {
        success: data.success,
        data: pData.data || [],
        pagination: {
          page: pData.page,
          limit: pData.limit,
          total: pData.total,
          totalPages: pData.totalPages,
          hasNextPage: pData.page < pData.totalPages,
          hasPrevPage: pData.page > 1
        }
      };
    }
    return data as PaginatedResponse<Role>;
  },

  getRoleById: async (id: string): Promise<ApiResponse<Role>> => {
    const { data } = await api.get<ApiResponse<Role>>(`${BASE_PATH}/${id}`);
    return data;
  },

  getSystemRoles: async (): Promise<ApiResponse<Role[]>> => {
    const { data } = await api.get<ApiResponse<Role[]>>(`${BASE_PATH}/system`);
    return data;
  },

  getCustomRoles: async (companyId?: string): Promise<ApiResponse<Role[]>> => {
    const { data } = await api.get<ApiResponse<Role[]>>(`${BASE_PATH}/custom`, { params: { companyId } });
    return data;
  },

  getCompanyRoles: async (companyId: string): Promise<ApiResponse<Role[]>> => {
    const { data } = await api.get<ApiResponse<Role[]>>(`${BASE_PATH}/company/${companyId}`);
    return data;
  },

  createRole: async (payload: CreateRolePayload): Promise<ApiResponse<Role>> => {
    const { data } = await api.post<ApiResponse<Role>>(BASE_PATH, payload);
    return data;
  },

  cloneRole: async (id: string, payload: Partial<CreateRolePayload>): Promise<ApiResponse<Role>> => {
    const { data } = await api.post<ApiResponse<Role>>(`${BASE_PATH}/${id}/clone`, payload);
    return data;
  },

  updateRole: async (id: string, payload: UpdateRolePayload): Promise<ApiResponse<Role>> => {
    const { data } = await api.patch<ApiResponse<Role>>(`${BASE_PATH}/${id}`, payload);
    return data;
  },

  deleteRole: async (id: string): Promise<ApiResponse<Role>> => {
    const { data } = await api.delete<ApiResponse<Role>>(`${BASE_PATH}/${id}`);
    return data;
  },

  restoreRole: async (id: string): Promise<ApiResponse<Role>> => {
    const { data } = await api.patch<ApiResponse<Role>>(`${BASE_PATH}/${id}/restore`);
    return data;
  },

  updateRoleStatus: async (id: string, status: string): Promise<ApiResponse<Role>> => {
    const { data } = await api.patch<ApiResponse<Role>>(`${BASE_PATH}/${id}/status`, { status });
    return data;
  },

  assignPermissions: async (id: string, permissions: string[]): Promise<ApiResponse<Role>> => {
    const { data } = await api.patch<ApiResponse<Role>>(`${BASE_PATH}/${id}/permissions`, { permissions });
    return data;
  },

  getRoleStatistics: async (): Promise<ApiResponse<RoleStatistics>> => {
    const { data } = await api.get<ApiResponse<RoleStatistics>>(`${BASE_PATH}/statistics`);
    return data;
  },
};
