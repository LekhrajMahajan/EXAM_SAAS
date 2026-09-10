import { Types } from "mongoose";
import userPermissionRepository from "./userPermission.repository";
import permissionRepository from "../permission/permission.repository";
import rolePermissionRepository from "../role-permission/rolePermission.repository";
import roleRepository from "../role/role.repository";
import userRepository from "../user/user.repository";
import companyRepository from "../company/company.repository";
import planRepository from "../plan/plan.repository";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction, AuditSeverity } from "../audit-log/auditLog.types";
import activityLogService from "../activity-log/activityLog.service";
import { ActivityType } from "../activity-log/activityLog.types";
import { permissionCache } from "../../middleware/permission";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import Permission from "../permission/permission.model";

class UserPermissionService {
  /**
   * Validate security barriers: Self-modification protection & privilege escalation protection
   */
  private async validateSecurityGuardrails(
    targetUserId: string,
    permissionIds: string[],
    actor?: any
  ) {
    if (!actor) return;

    // 1. Prevent Self-Modification: User cannot modify own permissions
    const actorId = actor._id?.toString() || actor.id || actor.userId;
    if (targetUserId === actorId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Security Policy: Users are strictly forbidden from modifying or overriding their own access permissions.");
    }

    // 2. Prevent Privilege Escalation: Company Admin cannot grant Master Admin exclusive permissions
    if (actor.role !== "MASTER_ADMIN" && actor.roleCode !== "MASTER_ADMIN" && actor.roleCode !== "SUPER_ADMIN") {
      const perms = await Permission.find({ _id: { $in: permissionIds } }).lean();
      for (const p of perms) {
        if (p.isSystem || p.isSystemPermission || p.module === "SYSTEM" || p.module === "MASTER_ADMIN") {
          throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            `Privilege Escalation Protection: Company Admins cannot grant or alter Master Admin / System level permission '${p.displayName || p.permissionKey}'.`
          );
        }
      }
    }
  }

  /**
   * Validate subscription feature constraints against target organization's plan
   */
  private async validateSubscriptionScope(companyId: string | null | undefined, permissionIds: string[]) {
    if (!companyId) return;

    const company = await companyRepository.findById(companyId.toString());
    if (!company || !(company as any).subscriptionPlan) return;

    const plan = await planRepository.findByPlanCode((company as any).subscriptionPlan);
    if (!plan || !plan.features) return;

    const perms = await Permission.find({ _id: { $in: permissionIds } }).lean();
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

    for (const perm of perms) {
      for (const [key, featureFlag] of Object.entries(featureMapping)) {
        if ((perm.module?.toLowerCase().includes(key) || perm.permissionKey?.toLowerCase().includes(key))) {
          const isEnabled = (plan.features as any)[featureFlag];
          if (isEnabled === false) {
            throw new ApiError(
              HTTP_STATUS.FORBIDDEN,
              `Subscription Limit Violation: Permission '${perm.displayName || perm.permissionKey}' cannot be overridden because feature '${featureFlag}' is excluded in plan '${plan.planName}'.`
            );
          }
        }
      }
    }
  }

  /**
   * Invalidate effective permission cache for real-time immediate refresh across UI and APIs
   */
  private invalidateEffectiveCache(userId: string, companyId?: string | null, role?: string) {
    permissionCache.invalidate(companyId ? companyId.toString() : undefined, role, userId);
    permissionCache.invalidate(undefined, undefined, userId);
  }

  /**
   * Record audit and activity trail for security compliance
   */
  private async logSecurityOverride(
    actionName: string,
    details: string,
    targetUserId: string,
    actor?: any,
    reqMetadata?: { ip?: string; userAgent?: string; reason?: string }
  ) {
    const actorId = actor?._id?.toString() || actor?.id || actor?.userId || targetUserId;
    const companyId = actor?.companyId || null;
    const reason = reqMetadata?.reason || "Administrative user permission override";

    try {
      await activityLogService.createActivity(
        "SECURITY",
        ActivityType.UPDATE,
        actionName,
        `${details} | Mandatory Reason: ${reason}`,
        actorId
      );
    } catch {
      // Non-blocking fallback if activity logging fails
    }

    try {
      await auditLogService.log({
        actorId,
        actorEmail: actor?.email || "admin@system.local",
        actorRole: actor?.role || "COMPANY_ADMIN",
        action: AuditAction.UPDATE,
        targetResource: "UserPermission",
        targetId: targetUserId,
        companyId,
        status: "SUCCESS",
        severity: AuditSeverity.HIGH,
        reason,
        ip: reqMetadata?.ip || "0.0.0.0",
        userAgent: reqMetadata?.userAgent || "Enterprise Middleware API",
        metadata: { timestamp: new Date().toISOString(), details, actionName },
      } as any);
    } catch {
      // Non-blocking fallback if audit log service structure varies
    }
  }

  /**
   * Assign or update a single permission override for a user
   */
  async assignOverride(
    targetUserId: string,
    data: {
      permissionId?: string;
      permissionIds?: string[];
      allowed?: boolean;
      isGranted?: boolean;
      source?: string;
      reason?: string;
      effectiveFrom?: string | null;
      effectiveUntil?: string | null;
      expiresAt?: string | null;
    },
    actor: any,
    reqMetadata: { ip?: string; userAgent?: string }
  ) {
    const targetIds = data.permissionIds && data.permissionIds.length > 0 
      ? data.permissionIds 
      : (data.permissionId ? [data.permissionId] : []);
      
    if (targetIds.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "At least one valid permissionId is required.");
    }

    await this.validateSecurityGuardrails(targetUserId, targetIds, actor);
    await this.validateSubscriptionScope(actor?.companyId, targetIds);

    const isAllowed = data.allowed !== undefined ? data.allowed : (data.isGranted !== undefined ? data.isGranted : true);
    const fromDate = data.effectiveFrom ? new Date(data.effectiveFrom) : null;
    const untilDate = data.effectiveUntil ? new Date(data.effectiveUntil) : (data.expiresAt ? new Date(data.expiresAt) : null);

    let source = data.source || "OVERRIDE";
    if (!data.source) {
      if (untilDate) {
        source = isAllowed ? "TEMPORARY_GRANT" : "TEMPORARY_DENY";
      } else {
        source = isAllowed ? "PERMANENT_GRANT" : "PERMANENT_DENY";
      }
    }

    const targetUser = await userRepository.findById(targetUserId);
    const companyId = targetUser?.companyId?.toString() || actor?.companyId?.toString() || null;

    if (targetIds.length === 1) {
      await userPermissionRepository.upsertOverride({
        userId: targetUserId,
        permissionId: targetIds[0],
        companyId,
        allowed: isAllowed,
        source,
        reason: data.reason || "Direct override assignment",
        effectiveFrom: fromDate,
        effectiveUntil: untilDate,
        createdBy: actor?._id?.toString() || actor?.id || actor?.userId,
      });
    } else {
      await userPermissionRepository.bulkUpsertOverrides(targetUserId, targetIds, {
        companyId,
        allowed: isAllowed,
        source,
        reason: data.reason || "Bulk override assignment",
        effectiveFrom: fromDate,
        effectiveUntil: untilDate,
        createdBy: actor?._id?.toString() || actor?.id || actor?.userId,
      });
    }

    this.invalidateEffectiveCache(targetUserId, companyId, targetUser?.role || targetUser?.roleCode);
    
    await this.logSecurityOverride(
      isAllowed ? "User Permission Grant Override" : "User Permission Deny Override",
      `Applied ${source} on ${targetIds.length} permission(s) for user ${targetUserId}`,
      targetUserId,
      actor,
      { ...reqMetadata, reason: data.reason || "Administrative user override assignment" }
    );

    return { success: true, message: `Successfully applied ${source} override(s) for user.`, count: targetIds.length };
  }

  /**
   * Get all explicit user permission overrides for target user
   */
  async getUserOverrides(targetUserId: string, companyId?: string | null) {
    return await userPermissionRepository.findAllByUser(targetUserId, companyId);
  }

  /**
   * Revoke explicit user permission overrides (revert to inherited role default)
   */
  async revokeOverrides(
    targetUserId: string,
    permissionIds: string[],
    actor: any,
    reqMetadata: { ip?: string; userAgent?: string; reason?: string },
    companyId?: string | null
  ) {
    if (!permissionIds || permissionIds.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "At least one permissionId must be provided to revoke override.");
    }

    const targetUser = await userRepository.findById(targetUserId);
    const compId = companyId || targetUser?.companyId?.toString() || actor?.companyId?.toString() || null;

    await userPermissionRepository.removeOverrides(targetUserId, permissionIds, compId);
    this.invalidateEffectiveCache(targetUserId, compId, targetUser?.role || targetUser?.roleCode);

    await this.logSecurityOverride(
      "Revoke User Permission Override",
      `Revoked ${permissionIds.length} explicit user override(s), reverting to role default`,
      targetUserId,
      actor,
      { ...reqMetadata, reason: reqMetadata?.reason || "Revoked override to restore role default policy" }
    );

    return { success: true, message: "User permission overrides revoked and reverted to role default.", revokedCount: permissionIds.length };
  }

  /**
   * Calculate Effective Permissions with complete Difference View highlighters:
   * Displays Inherited, Granted, Denied, and Temporary states based on Resolution Order:
   * (1) Explicit User Override -> (2) Role Permission -> (3) Subscription Feature -> (4) System Policy
   */
  async getEffectivePermissions(targetUserId: string, actor?: any) {
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Target user not found.");
    }

    const companyId = targetUser.companyId?.toString() || actor?.companyId?.toString() || null;
    const userRoleCode = targetUser.roleCode || targetUser.role;

    // 1. Fetch all system permissions
    const allPermissions: any[] = await Permission.find({ isDeleted: false }).sort({ module: 1, name: 1 }).lean();

    // 2. Fetch Role Permissions
    let rolePermIds = new Set<string>();
    if (userRoleCode) {
      const role = await roleRepository.findByCode(userRoleCode, companyId || undefined);
      if (role && role._id) {
        const rolePerms = await rolePermissionRepository.findByRoleId(role._id.toString());
        rolePerms.forEach((rp: any) => {
          if (rp.permissionId) {
            const pid = rp.permissionId._id ? rp.permissionId._id.toString() : rp.permissionId.toString();
            rolePermIds.add(pid);
          }
        });
      }
    }

    // Master Admin override gets all permissions by default role inheritance
    if (userRoleCode === "MASTER_ADMIN" || userRoleCode === "SUPER_ADMIN") {
      allPermissions.forEach((p) => rolePermIds.add(p._id.toString()));
    }

    // 3. Fetch explicit User Permission Overrides (active and inactive/expired)
    const overrides = await userPermissionRepository.findAllByUser(targetUserId, companyId);
    const overrideMap = new Map<string, any>();
    const now = new Date();

    overrides.forEach((ov: any) => {
      if (!ov.isDeleted && ov.status === "ACTIVE") {
        const permId = ov.permissionId?._id ? ov.permissionId._id.toString() : ov.permissionId?.toString();
        if (permId) overrideMap.set(permId, ov);
      }
    });

    // 4. Build Difference View matrix
    const effectiveMatrix = allPermissions.map((perm) => {
      const permId = perm._id.toString();
      const ov = overrideMap.get(permId);
      const isRoleInherited = rolePermIds.has(permId);

      let status = isRoleInherited ? "INHERITED" : "DEFAULT";
      let isTemporary = false;
      let isGranted = isRoleInherited;
      let effectiveFrom = null;
      let effectiveUntil = null;
      let reason = "";
      let source = isRoleInherited ? "ROLE" : "DEFAULT_SYSTEM_POLICY";
      let overrideId = null;

      if (ov) {
        overrideId = ov._id.toString();
        reason = ov.reason || "";
        effectiveFrom = ov.effectiveFrom || null;
        effectiveUntil = ov.effectiveUntil || ov.expiresAt || null;
        isTemporary = !!(effectiveUntil || effectiveFrom);

        // Check if temporary override has expired or hasn't started yet
        const notStarted = effectiveFrom && new Date(effectiveFrom) > now;
        const isExpired = effectiveUntil && new Date(effectiveUntil) <= now;

        if (notStarted || isExpired) {
          // Automatic Expiry: Expired overrides stop automatically without manual cleanup! Revert to inherited
          status = isRoleInherited ? "INHERITED" : "DEFAULT";
        } else {
          // Active User Override (Highest Priority in Resolution Order!)
          isGranted = ov.allowed !== undefined ? ov.allowed : ov.isGranted;
          status = isGranted ? "GRANTED" : "DENIED";
          source = ov.source || (isGranted ? "USER_OVERRIDE_GRANT" : "USER_OVERRIDE_DENY");
        }
      }

      return {
        permissionId: permId,
        name: perm.name,
        displayName: perm.displayName || perm.name,
        module: perm.module || "GENERAL",
        action: perm.action || "VIEW",
        description: perm.description || "",
        status, // "GRANTED", "DENIED", "INHERITED", "DEFAULT"
        isGranted,
        isTemporary,
        source,
        reason,
        effectiveFrom,
        effectiveUntil,
        overrideId,
        isSystem: !!(perm.isSystem || perm.isSystemPermission)
      };
    });

    return {
      userId: targetUserId,
      userName: targetUser.firstName ? `${targetUser.firstName} ${targetUser.lastName || ""}`.trim() : targetUser.email || targetUserId,
      roleCode: userRoleCode,
      companyId,
      permissions: effectiveMatrix,
      summary: {
        total: effectiveMatrix.length,
        effectiveGranted: effectiveMatrix.filter((m) => m.isGranted).length,
        inheritedCount: effectiveMatrix.filter((m) => m.status === "INHERITED").length,
        overriddenGrantedCount: effectiveMatrix.filter((m) => m.status === "GRANTED").length,
        overriddenDeniedCount: effectiveMatrix.filter((m) => m.status === "DENIED").length,
        temporaryCount: effectiveMatrix.filter((m) => m.isTemporary && (m.status === "GRANTED" || m.status === "DENIED")).length,
      }
    };
  }
}

export default new UserPermissionService();
