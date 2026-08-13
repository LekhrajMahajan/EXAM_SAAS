import mongoose from "mongoose";
import roleRepository from "../role/role.repository";
import permissionRepository from "../permission/permission.repository";
import rolePermissionRepository from "./rolePermission.repository";
import companyRepository from "../company/company.repository";
import planRepository from "../plan/plan.repository";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction } from "../audit-log/auditLog.types";
import { permissionCache } from "../../middleware/permission";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

class RolePermissionService {
  private matrixCache = new Map<string, { data: any; timestamp: number }>();
  private readonly MATRIX_TTL = 5 * 60 * 1000; // 5 minutes TTL

  private invalidateAllCaches(companyId?: string, roleCode?: string) {
    permissionCache.invalidate(companyId, roleCode);
    this.matrixCache.clear();
  }

  /*
  |--------------------------------------------------------------------------
  | Validation Helpers (Subscription & Hierarchy Protection)
  |--------------------------------------------------------------------------
  */

  private async validateRoleModification(role: any, user?: any) {
    if (!role) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
    }

    // System Roles Protection
    if (role.roleCode === "MASTER_ADMIN" || role.roleCode === "SUPER_ADMIN") {
      if (user && user.role !== "MASTER_ADMIN" && user.roleCode !== "MASTER_ADMIN" && user.roleCode !== "SUPER_ADMIN") {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "Protected System Roles cannot have their permissions modified.");
      }
    }

    // Role Hierarchy Protection
    if (user && user.roleCode !== "MASTER_ADMIN" && user.role !== "MASTER_ADMIN" && user.roleCode !== "SUPER_ADMIN") {
      if (role.isSystem === true || role.systemRole === true) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "Role Hierarchy Protection: You do not have permission to modify system-level roles.");
      }
    }
  }

  private async validateSubscriptionLimits(companyId: string | null | undefined, permissions: any[]) {
    if (!companyId) return;

    const company = await companyRepository.findById(companyId.toString());
    if (!company || !(company as any).subscriptionPlan) return;

    const plan = await planRepository.findByPlanCode((company as any).subscriptionPlan);
    if (!plan || !plan.features) return;

    const featureMapping: Record<string, string> = {
      "question_bank": "questionBank",
      "live_monitoring": "liveMonitoring",
      "geo_monitoring": "geoMonitoring",
      "biometric": "biometric",
      "ai_proctor": "basicAiProctoring",
      "full_ai": "fullAiProctoring",
      "audit_logs": "auditLogs",
      "custom_branding": "customBranding",
      "api_access": "apiAccess",
      "bulk_upload": "bulkUpload",
      "data_export": "dataExport",
      "custom_reports": "customReports",
      "email_notifications": "emailNotifications",
      "sms_notifications": "smsNotifications"
    };

    for (const perm of permissions) {
      for (const [key, featureFlag] of Object.entries(featureMapping)) {
        if ((perm.module?.toLowerCase().includes(key) || perm.permissionKey?.toLowerCase().includes(key))) {
          const isEnabled = (plan.features as any)[featureFlag];
          if (isEnabled === false) {
            throw new ApiError(
              HTTP_STATUS.FORBIDDEN,
              `Subscription Limit: Permission '${perm.displayName || perm.permissionKey}' cannot be assigned because feature '${featureFlag}' is disabled in your active subscription plan (${plan.planName}).`
            );
          }
        }
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Assign Permissions
  |--------------------------------------------------------------------------
  */

  async assignPermissions(roleId: string, permissionIds: string[], user?: any) {
    const role = await roleRepository.findById(roleId);
    await this.validateRoleModification(role, user);

    const uniquePermissionIds = [...new Set(permissionIds)];
    const permissions = await permissionRepository.findByIds(uniquePermissionIds);

    if (permissions.length !== uniquePermissionIds.length) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "One or more permissions are invalid.");
    }

    // Check Role Hierarchy protection on targeted permissions
    if (user && user.roleCode !== "MASTER_ADMIN" && user.role !== "MASTER_ADMIN" && user.roleCode !== "SUPER_ADMIN") {
      const forbiddenPerm = permissions.find((p: any) => p.isSystemPermission === true || p.module === "SUPER_ADMIN" || p.module === "SYSTEM_SETTINGS");
      if (forbiddenPerm) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, `Role Hierarchy Protection: Cannot assign system-level permission '${(forbiddenPerm as any).displayName}'.`);
      }
    }

    // Check Subscription plan limits
    await this.validateSubscriptionLimits(role?.companyId?.toString() || user?.companyId, permissions);

    const oldPermissions = Array.isArray(role?.permissions) ? (role.permissions as any[]).map(p => typeof p === "object" ? (p._id || p).toString() : p.toString()) : [];

    // Save to Role Document
    await roleRepository.assignPermissions(roleId, uniquePermissionIds);

    // Synchronize RolePermission collection via repository
    const compId = role?.companyId ? role.companyId.toString() : null;
    for (const pId of uniquePermissionIds) {
      await rolePermissionRepository.syncRolePermission(roleId, pId, compId, true);
    }
    await rolePermissionRepository.deactivateUnselected(roleId, uniquePermissionIds);

    this.invalidateAllCaches(compId || undefined, role?.roleCode);

    // Audit Logging
    if (user && user._id) {
      const added = uniquePermissionIds.filter(id => !oldPermissions.includes(id));
      const removed = oldPermissions.filter((id: string) => !uniquePermissionIds.includes(id));
      const description = `Updated permissions for role ${role?.name}. Added: ${added.length}, Removed: ${removed.length}`;
      await auditLogService.logSuccess({
        action: AuditAction.UPDATE,
        module: "ROLE_PERMISSION" as any,
        entityId: new mongoose.Types.ObjectId(roleId),
        entityName: role?.name || "Role",
        description,
        performedBy: new mongoose.Types.ObjectId(user._id.toString()),
        companyId: compId ? new mongoose.Types.ObjectId(compId) : undefined,
      });
    }

    return await roleRepository.findById(roleId, ["permissions"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Role Permissions
  |--------------------------------------------------------------------------
  */

  async getPermissions(roleId: string) {
    const role = await roleRepository.findById(roleId, ["permissions"]);
    if (!role) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Role not found.");
    }
    return role;
  }

  /*
  |--------------------------------------------------------------------------
  | Replace Permissions
  |--------------------------------------------------------------------------
  */

  async replacePermissions(roleId: string, permissionIds: string[], user?: any) {
    return this.assignPermissions(roleId, permissionIds, user);
  }

  /*
  |--------------------------------------------------------------------------
  | Remove Single Permission
  |--------------------------------------------------------------------------
  */

  async removePermission(roleId: string, permissionId: string, user?: any) {
    const role = await roleRepository.findById(roleId);
    await this.validateRoleModification(role, user);

    const compId = role?.companyId ? role.companyId.toString() : null;
    const currentPerms = Array.isArray(role?.permissions) ? (role.permissions as any[]).map(p => typeof p === "object" ? (p._id || p).toString() : p.toString()) : [];
    const newPerms = currentPerms.filter(id => id !== permissionId);

    await roleRepository.assignPermissions(roleId, newPerms);
    await rolePermissionRepository.deactivateByRoleAndPermission(roleId, permissionId);

    this.invalidateAllCaches(compId || undefined, role?.roleCode);

    if (user && user._id) {
      await auditLogService.logSuccess({
        action: AuditAction.DELETE,
        module: "ROLE_PERMISSION" as any,
        entityId: new mongoose.Types.ObjectId(roleId),
        entityName: role?.name || "Role",
        description: `Removed permission ${permissionId} from role ${role?.name}`,
        performedBy: new mongoose.Types.ObjectId(user._id.toString()),
        companyId: compId ? new mongoose.Types.ObjectId(compId) : undefined,
      });
    }

    return await roleRepository.findById(roleId, ["permissions"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Clear All Permissions
  |--------------------------------------------------------------------------
  */

  async clearPermissions(roleId: string, user?: any) {
    const role = await roleRepository.findById(roleId);
    await this.validateRoleModification(role, user);

    const compId = role?.companyId ? role.companyId.toString() : null;
    await roleRepository.assignPermissions(roleId, []);
    await rolePermissionRepository.deactivateAllByRoleId(roleId);

    this.invalidateAllCaches(compId || undefined, role?.roleCode);

    if (user && user._id) {
      await auditLogService.logSuccess({
        action: AuditAction.DELETE,
        module: "ROLE_PERMISSION" as any,
        entityId: new mongoose.Types.ObjectId(roleId),
        entityName: role?.name || "Role",
        description: `Cleared all permissions for role ${role?.name}`,
        performedBy: new mongoose.Types.ObjectId(user._id.toString()),
        companyId: compId ? new mongoose.Types.ObjectId(compId) : undefined,
      });
    }

    return await roleRepository.findById(roleId, ["permissions"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Permission Matrix (Enterprise 2D View)
  |--------------------------------------------------------------------------
  */

  async getPermissionMatrix(companyId?: string, user?: any) {
    const filterCompanyId = companyId || user?.companyId;
    const cacheKey = filterCompanyId ? filterCompanyId.toString() : "ROOT";

    const cached = this.matrixCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.MATRIX_TTL) {
      return cached.data;
    }

    const roles = await roleRepository.findAllActive(cacheKey === "ROOT" ? undefined : cacheKey);
    const permissions = await permissionRepository.findAllActive(cacheKey === "ROOT" ? undefined : cacheKey);
    const assignments = await rolePermissionRepository.findMatrixByCompany(cacheKey === "ROOT" ? undefined : cacheKey);

    let planFeatures: Record<string, boolean> | null = null;
    if (cacheKey !== "ROOT") {
      const company = await companyRepository.findById(cacheKey);
      if (company && (company as any).subscriptionPlan) {
        const plan = await planRepository.findByPlanCode((company as any).subscriptionPlan);
        if (plan && plan.features) {
          planFeatures = plan.features as any;
        }
      }
    }

    const featureMapping: Record<string, string> = {
      "question_bank": "questionBank",
      "live_monitoring": "liveMonitoring",
      "geo_monitoring": "geoMonitoring",
      "biometric": "biometric",
      "ai_proctor": "basicAiProctoring",
      "full_ai": "fullAiProctoring",
      "audit_logs": "auditLogs",
      "custom_branding": "customBranding",
      "api_access": "apiAccess",
      "bulk_upload": "bulkUpload",
      "data_export": "dataExport",
      "custom_reports": "customReports",
    };

    const permissionsWithStatus = permissions.map((p: any) => {
      let isLockedBySubscription = false;
      let lockedReason = "";
      if (planFeatures) {
        for (const [key, featureFlag] of Object.entries(featureMapping)) {
          if ((p.module?.toLowerCase().includes(key) || p.permissionKey?.toLowerCase().includes(key))) {
            const isEnabled = planFeatures[featureFlag];
            if (isEnabled === false) {
              isLockedBySubscription = true;
              lockedReason = `Requires ${featureFlag} plan feature`;
              break;
            }
          }
        }
      }
      return {
        ...p,
        isLockedBySubscription,
        lockedReason,
      };
    });

    const assignmentMap: Record<string, Record<string, boolean>> = {};
    roles.forEach((r: any) => {
      const rId = (r._id || r).toString();
      assignmentMap[rId] = {};
    });

    assignments.forEach((a: any) => {
      const rId = a.roleId?.toString();
      const pId = a.permissionId?.toString();
      if (rId && pId && assignmentMap[rId] !== undefined) {
        assignmentMap[rId][pId] = a.allowed !== false;
      }
    });

    roles.forEach((r: any) => {
      const rId = (r._id || r).toString();
      if (Array.isArray(r.permissions) && assignmentMap[rId]) {
        r.permissions.forEach((p: any) => {
          const pId = typeof p === "object" ? (p._id || p).toString() : p.toString();
          assignmentMap[rId][pId] = true;
        });
      }
    });

    const matrixData = {
      roles,
      permissions: permissionsWithStatus,
      matrix: assignmentMap,
      generatedAt: new Date().toISOString(),
    };

    this.matrixCache.set(cacheKey, { data: matrixData, timestamp: Date.now() });
    return matrixData;
  }
}

export default new RolePermissionService();
