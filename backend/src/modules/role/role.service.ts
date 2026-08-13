import roleRepository from "./role.repository";
import companyRepository from "../company/company.repository";
import RolePermission, { RolePermissionStatus } from "../role-permission/rolePermission.model";
import { permissionCache } from "../../middleware/permission";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import Role from "./role.model";
import Permission from "../permission/permission.model";
import { PermissionStatus } from "../permission/permission.types";
import { IRole, RoleStatus, RoleType, RoleCategory } from "./role.types";
import { BaseService } from "../../common/base.service";
import organizationSeederService from "../organization-seeder/organizationSeeder.service";

class RoleService extends BaseService<IRole> {
  constructor() {
    super(roleRepository, "Role");
  }
  /*
  |--------------------------------------------------------------------------
  | Create Role
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IRole>) {
    if (payload.companyId) {
      const company = await companyRepository.findById(
        payload.companyId.toString(),
      );

      if (!company) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found.");
      }
    }

    const existingRole = await roleRepository.findByName(
      payload.name!,
      payload.companyId?.toString(),
    );

    if (existingRole) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Role already exists.");
    }

    if (payload.roleCode) {
      const existingCode = await roleRepository.findByCode(
        payload.roleCode,
        payload.companyId?.toString()
      );

      if (existingCode) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Role code already exists.");
      }
    }

    if (payload.parentRole) {
      const parent = await roleRepository.findById(payload.parentRole.toString());
      if (!parent) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Parent role not found.");
      }
    }

    const createdRole = await super.create(payload);
    
    // Sync to RolePermission collection if permissions provided at creation time
    if (payload.permissions && payload.permissions.length > 0) {
      for (const pId of payload.permissions) {
        await RolePermission.findOneAndUpdate(
          { roleId: (createdRole as any)._id, permissionId: pId, companyId: payload.companyId || null },
          { status: RolePermissionStatus.ACTIVE, isDeleted: false },
          { upsert: true, new: true }
        );
      }
    }
    
    permissionCache.invalidate(payload.companyId?.toString(), payload.roleCode);
    return createdRole;
  }

  /*
  |--------------------------------------------------------------------------
  | Clone Role
  |--------------------------------------------------------------------------
  */

  async cloneRole(
    sourceRoleId: string,
    payload: {
      name: string;
      roleCode: string;
      displayName?: string;
      description?: string;
      permissionIds?: string[];
      companyId?: string;
    }
  ) {
    const sourceRole = await roleRepository.findById(sourceRoleId);
    if (!sourceRole) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Source role not found for cloning.");
    }

    const companyId = payload.companyId || sourceRole.companyId?.toString();
    if (companyId) {
      const company = await companyRepository.findById(companyId);
      if (!company) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found.");
      }
    }

    const existingName = await roleRepository.findByName(payload.name, companyId);
    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "A role with this name already exists.");
    }

    const existingCode = await roleRepository.findByCode(payload.roleCode, companyId);
    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "A role with this code already exists.");
    }

    const targetPermissionIds = payload.permissionIds || sourceRole.permissions;

    const createdRole = await super.create({
      name: payload.name,
      displayName: payload.displayName || payload.name,
      roleCode: payload.roleCode.toUpperCase(),
      description: payload.description || `Cloned from ${sourceRole.displayName}`,
      hierarchyLevel: sourceRole.hierarchyLevel || 5,
      roleType: sourceRole.roleType || "CUSTOM",
      category: sourceRole.category || "CUSTOM",
      priority: sourceRole.priority ?? 50,
      color: sourceRole.color || "#3b82f6",
      icon: sourceRole.icon || "ShieldCheck",
      parentRole: sourceRole.parentRole || null,
      companyId: companyId ? (companyId as any) : null,
      isSystem: false,
      isCustom: true,
      clonedFrom: (sourceRole._id as any),
      permissions: targetPermissionIds as any,
    });

    // Synchronize records in RolePermission collection
    for (const pId of targetPermissionIds) {
      await RolePermission.findOneAndUpdate(
        { roleId: (createdRole as any)._id, permissionId: pId, companyId: companyId || null },
        { status: RolePermissionStatus.ACTIVE, isDeleted: false },
        { upsert: true, new: true }
      );
    }

    permissionCache.invalidate(companyId, (createdRole as any).roleCode);
    return createdRole;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Role
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IRole>) {
    const role = await roleRepository.findById(id);

    if (!role) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
    }

    if (role.isSystem) {
      if (
        (payload.name && payload.name !== role.name) ||
        (payload.roleCode && payload.roleCode !== role.roleCode)
      ) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "System roles cannot be renamed or have their code changed.",
        );
      }
    }

    if (payload.name && payload.name !== role.name) {
      const existingRole = await roleRepository.findByName(
        payload.name,
        payload.companyId?.toString() || role.companyId?.toString(),
      );

      if (existingRole && existingRole.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Role name already exists.");
      }
    }

    if (payload.roleCode && payload.roleCode !== role.roleCode) {
      const existingCode = await roleRepository.findByCode(
        payload.roleCode,
        payload.companyId?.toString() || role.companyId?.toString(),
      );

      if (existingCode && existingCode.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Role code already exists.");
      }
    }

    if (payload.parentRole) {
      if (payload.parentRole.toString() === id) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Role cannot be its own parent.");
      }
      
      const parent = await roleRepository.findById(payload.parentRole.toString());
      if (!parent) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Parent role not found.");
      }
      
      // Basic circular check (1 level up)
      if (parent.parentRole?.toString() === id) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Circular hierarchy detected.");
      }
    }

    const updated = await super.update(id, payload);
    permissionCache.invalidate(role.companyId?.toString(), role.roleCode);
    return updated;
  }

  /*
  |--------------------------------------------------------------------------
  | Assign Permissions
  |--------------------------------------------------------------------------
  */

  async assignPermissions(id: string, permissions: string[]) {
    const role = await roleRepository.findById(id);

    if (!role) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
    }

    if (role.isSystem) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Cannot modify system role permissions.",
      );
    }

    const res = await roleRepository.assignPermissions(id, permissions);
    permissionCache.invalidate(role.companyId?.toString(), role.roleCode);
    return res;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: string) {
    const role = await roleRepository.findById(id);

    if (!role) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
    }

    if (role.isSystem) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "System role status cannot be changed.",
      );
    }

    const res = await super.updateStatus(id, status);
    permissionCache.invalidate(role.companyId?.toString(), role.roleCode);
    return res;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Role
  |--------------------------------------------------------------------------
  */

  async delete(id: string) {
    const role = await roleRepository.findById(id);

    if (!role) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
    }

    if (role.isSystem) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "System roles cannot be deleted.",
      );
    }

    const res = await super.delete(id);
    permissionCache.invalidate(role.companyId?.toString(), role.roleCode);
    return res;
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    const filter: Record<string, unknown> = {};
    if (companyId) filter.companyId = companyId;
    
    const [total, active, inactive, systemRoles, customRoles] = await Promise.all([
      roleRepository.count(filter),
      roleRepository.count({ ...filter, status: 'ACTIVE' }),
      roleRepository.count({ ...filter, status: 'INACTIVE' }),
      roleRepository.count({ ...filter, isSystem: true }),
      roleRepository.count({ ...filter, isSystem: false }),
    ]);

    return {
      total,
      active,
      inactive,
      systemRoles,
      customRoles
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Phase 4.2: Dynamic Role Getters & Default Seeding
  |--------------------------------------------------------------------------
  */

  async getSystemRoles() {
    return await roleRepository.findSystemRoles();
  }

  async getCustomRoles(companyId?: string) {
    return await roleRepository.findCustomRoles(companyId);
  }

  async getCompanyRoles(companyId: string) {
    return await roleRepository.findByCompanyId(companyId);
  }

  async initializeCompanyDefaultRoles(companyId: string) {
    if (!companyId) return;
    try {
      await organizationSeederService.initializeOrganization(companyId, "system");
      console.log(`Initialized complete organization defaults and RBAC roles for company: ${companyId}`);
    } catch (err) {
      console.error("Failed to initialize company organization defaults:", err);
    }
  }
}

export default new RoleService();
