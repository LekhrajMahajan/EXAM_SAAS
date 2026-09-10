import mongoose from "mongoose";
import permissionRepository from "./permission.repository";
import companyRepository from "../company/company.repository";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction } from "../audit-log/auditLog.types";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { IPermission, PermissionDocument, PermissionStatus } from "./permission.types";
import { BaseService } from "../../common/base.service";

class PermissionService extends BaseService<IPermission> {
  constructor() {
    super(permissionRepository, "Permission");
  }

  /*
  |--------------------------------------------------------------------------
  | Helper: Record Audit Log
  |--------------------------------------------------------------------------
  */
  private async recordAudit(
    action: AuditAction,
    entityId: string,
    description: string,
    performedBy?: string
  ) {
    if (!performedBy || !mongoose.Types.ObjectId.isValid(performedBy)) {
      return;
    }
    try {
      await auditLogService.logSuccess({
        action,
        module: "PERMISSION" as any,
        entityId: new mongoose.Types.ObjectId(entityId),
        entityName: "Permission",
        description,
        performedBy: new mongoose.Types.ObjectId(performedBy),
      });
    } catch (e) {
      // Non-blocking logging
      console.error("[PermissionService] Audit log error:", e);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Create Permission
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IPermission>, session?: mongoose.ClientSession, performedBy?: string): Promise<any> {
    if (payload.companyId) {
      const company = await companyRepository.findById(
        payload.companyId.toString(),
      );

      if (!company) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found.");
      }
    }

    // Auto-generate name and permissionKey if missing
    if (!payload.permissionKey && payload.module && payload.action) {
      payload.permissionKey = `${payload.module.toString().toLowerCase()}.${payload.action.toString().toLowerCase()}`;
    }
    if (payload.permissionKey) {
      payload.name = payload.permissionKey.toLowerCase();
      payload.permissionKey = payload.permissionKey.toLowerCase();
      if (!payload.resource) {
        payload.resource = payload.permissionKey.split(".")[0] || "system";
      }
    }
    if (!payload.group && payload.module) {
      const modStr = payload.module.toString();
      payload.group = modStr.charAt(0) + modStr.slice(1).toLowerCase().replace(/_/g, " ");
    }
    if (!payload.category) {
      payload.category = "FEATURE";
    }
    if (payload.isSystem === true || payload.isSystemPermission === true) {
      payload.isSystem = true;
      payload.isSystemPermission = true;
    }

    // Unique PermissionKey Validation
    const existingKey = await permissionRepository.findByPermissionKey(
      payload.permissionKey!,
      payload.companyId?.toString()
    );
    if (existingKey) {
      throw new ApiError(HTTP_STATUS.CONFLICT, `Permission key "${payload.permissionKey}" already exists.`);
    }

    // Unique DisplayName Validation
    if (payload.displayName) {
      const existingName = await permissionRepository.findByDisplayName(
        payload.displayName,
        payload.companyId?.toString()
      );
      if (existingName) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Permission display name "${payload.displayName}" already exists.`);
      }
    }

    // Unique Module & Action Validation
    if (payload.module && payload.action) {
      const existingPerm = await permissionRepository.findByModuleAction(
        payload.module.toString(),
        payload.action.toString(),
        payload.companyId?.toString(),
      );
      if (existingPerm) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Permission for module "${payload.module}" and action "${payload.action}" already exists.`);
      }
    }

    const result = await super.create(payload, session);
    await this.recordAudit(
      AuditAction.CREATE,
      (result as any)._id.toString(),
      `Created permission: ${payload.displayName || payload.permissionKey}`,
      performedBy
    );
    return result as any;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Permission
  |--------------------------------------------------------------------------
  */

  async update(
    id: string,
    payload: Partial<IPermission>,
    populateFields?: string[],
    session?: mongoose.ClientSession,
    performedBy?: string
  ): Promise<any> {
    const permission: PermissionDocument | null = await permissionRepository.findById(id) as PermissionDocument | null;

    if (!permission) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Permission not found.");
    }

    if (permission.isSystem || permission.isSystemPermission) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "System permissions cannot be updated.",
      );
    }

    if (payload.permissionKey && payload.permissionKey.toLowerCase() !== permission.permissionKey) {
      const existingKey = await permissionRepository.findByPermissionKey(
        payload.permissionKey,
        payload.companyId?.toString() || permission.companyId?.toString()
      );
      if (existingKey && existingKey._id.toString() !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Permission key "${payload.permissionKey}" already exists.`);
      }
      payload.name = payload.permissionKey.toLowerCase();
    }

    if (payload.displayName && payload.displayName !== permission.displayName) {
      const existingName = await permissionRepository.findByDisplayName(
        payload.displayName,
        payload.companyId?.toString() || permission.companyId?.toString()
      );
      if (existingName && existingName._id.toString() !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Permission display name "${payload.displayName}" already exists.`);
      }
    }

    if (payload.module && payload.action) {
      const existing = await permissionRepository.findByModuleAction(
        payload.module.toString(),
        payload.action.toString(),
        payload.companyId?.toString() || permission.companyId?.toString(),
      );
      if (existing && existing._id.toString() !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Permission for module "${payload.module}" and action "${payload.action}" already exists.`);
      }
    }

    const result = await super.update(id, payload, populateFields, session);
    await this.recordAudit(
      AuditAction.UPDATE,
      id,
      `Updated permission: ${payload.displayName || permission.displayName}`,
      performedBy
    );
    return result as any;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete (Soft Delete)
  |--------------------------------------------------------------------------
  */

  async delete(id: string, session?: mongoose.ClientSession, performedBy?: string): Promise<any> {
    const permission: PermissionDocument | null = await permissionRepository.findById(id) as PermissionDocument | null;

    if (!permission) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Permission not found.");
    }

    if (permission.isSystem || permission.isSystemPermission) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "System permissions cannot be deleted.",
      );
    }

    const updatePayload: any = {
      isDeleted: true,
      deletedAt: new Date(),
      status: PermissionStatus.INACTIVE,
    };
    if (performedBy && mongoose.Types.ObjectId.isValid(performedBy)) {
      updatePayload.deletedBy = new mongoose.Types.ObjectId(performedBy);
    }

    const result = await permissionRepository.update(id, updatePayload);
    await this.recordAudit(
      AuditAction.DELETE,
      id,
      `Soft deleted permission: ${permission.displayName || permission.permissionKey}`,
      performedBy
    );
    return result as any;
  }

  /*
  |--------------------------------------------------------------------------
  | Restore Permission
  |--------------------------------------------------------------------------
  */

  async restore(id: string, session?: mongoose.ClientSession, performedBy?: string): Promise<any> {
    const permission = await permissionRepository.findWithDeletedById(id);

    if (!permission) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Permission not found.");
    }

    const result = await permissionRepository.update(id, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      status: PermissionStatus.ACTIVE,
    } as any);

    await this.recordAudit(
      AuditAction.UPDATE,
      id,
      `Restored permission: ${permission.displayName || permission.permissionKey}`,
      performedBy
    );
    return result as any;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(
    id: string,
    status: string,
    populateFields?: string[],
    session?: mongoose.ClientSession,
    performedBy?: string
  ): Promise<any> {
    const permission: PermissionDocument | null = await permissionRepository.findById(id) as PermissionDocument | null;

    if (!permission) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Permission not found.");
    }

    if (permission.isSystem || permission.isSystemPermission) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "System permissions status cannot be modified.",
      );
    }

    const result = await super.updateStatus(id, status as any, populateFields, session);
    await this.recordAudit(
      AuditAction.UPDATE,
      id,
      `Changed status of permission "${permission.displayName}" to ${status}`,
      performedBy
    );
    return result as any;
  }

  /*
  |--------------------------------------------------------------------------
  | Search Permissions
  |--------------------------------------------------------------------------
  */

  async search(params: any) {
    return await permissionRepository.searchPermissions(params);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Group
  |--------------------------------------------------------------------------
  */

  async getByGroup(group: string, companyId?: string) {
    return await permissionRepository.findByGroup(group, companyId);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Module
  |--------------------------------------------------------------------------
  */

  async getByModule(moduleName: string, companyId?: string) {
    return await permissionRepository.findByModule(moduleName, companyId);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    const baseFilter: Record<string, unknown> = {};
    if (companyId) {
      baseFilter.$or = [{ companyId: null }, { companyId }];
    }

    const [total, active, inactive, systemPermissions, customPermissions] =
      await Promise.all([
        permissionRepository.countByFilter(baseFilter),
        permissionRepository.countByFilter({ ...baseFilter, status: "ACTIVE" }),
        permissionRepository.countByFilter({ ...baseFilter, status: "INACTIVE" }),
        permissionRepository.countByFilter({ ...baseFilter, $or: [{ isSystem: true }, { isSystemPermission: true }] }),
        permissionRepository.countByFilter({ ...baseFilter, isSystem: false, isSystemPermission: false }),
      ]);

    return {
      total,
      active,
      inactive,
      systemPermissions,
      customPermissions,
    };
  }
}

export default new PermissionService();
