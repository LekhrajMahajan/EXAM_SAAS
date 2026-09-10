import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import Role from "../modules/role/role.model";
import RolePermission, { RolePermissionStatus } from "../modules/role-permission/rolePermission.model";
import UserPermission, { UserPermissionStatus } from "../modules/user-permission/userPermission.model";
import Permission from "../modules/permission/permission.model";
import { PermissionStatus } from "../modules/permission/permission.types";
import auditLogService from "../modules/audit-log/auditLog.service";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

function logPermissionViolation(req: Request, reason: string): void {
  try {
    const user: any = req.user || {};
    auditLogService.log({
      actorId: user._id?.toString() || user.id || "unauthorized_user",
      actorEmail: user.email || "anonymous@system.local",
      actorRole: user.role || "UNKNOWN",
      action: AuditAction.REJECT,
      module: "RBAC / Permission",
      targetResource: req.baseUrl || req.path || "API",
      description: `Permission Denied: ${reason}`,
      companyId: user.companyId || undefined,
      status: AuditStatus.FAILED,
      severity: AuditSeverity.HIGH,
      ip: req.ip || req.socket?.remoteAddress || "0.0.0.0",
      userAgent: req.headers["user-agent"] || "UNKNOWN",
      metadata: { path: req.originalUrl, method: req.method, reason },
    } as any).catch(() => {});
  } catch {
    // Non-blocking fallback
  }
}

// High-performance in-memory permission cache with instantaneous invalidation capability
interface CacheEntry {
  permissions: Set<string>;
  timestamp: number;
}

class PermissionCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes default TTL

  private getCacheKey(companyId: string, roleCode: string, userId: string): string {
    return `${companyId || "ROOT"}:${roleCode}:${userId}`;
  }

  get(companyId: string, roleCode: string, userId: string): Set<string> | null {
    const key = this.getCacheKey(companyId, roleCode, userId);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return entry.permissions;
  }

  set(companyId: string, roleCode: string, userId: string, permissions: Set<string>): void {
    const key = this.getCacheKey(companyId, roleCode, userId);
    this.cache.set(key, { permissions, timestamp: Date.now() });
  }

  // Invalidate cache for an entire company or a specific role/user when RBAC rules change
  invalidate(companyId?: string, roleCode?: string, userId?: string): void {
    if (!companyId && !roleCode && !userId) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (companyId && key.startsWith(`${companyId}:`)) {
        this.cache.delete(key);
      } else if (roleCode && key.includes(`:${roleCode}:`)) {
        this.cache.delete(key);
      } else if (userId && key.endsWith(`:${userId}`)) {
        this.cache.delete(key);
      }
    }
  }
}

export const permissionCache = new PermissionCache();

/**
 * Core engine helper to resolve all granted permission keys for a given user & role
 */
export async function resolveUserPermissions(user: any): Promise<Set<string>> {
  if (!user) return new Set();

  const roleStr: string = user.role || "";
  const userIdStr: string = user._id ? user._id.toString() : "";
  const companyIdStr: string = user.companyId ? user.companyId.toString() : "";

  // Master Admin and System Super Admin always possess all permissions
  if (roleStr === UserRole.MASTER_ADMIN || roleStr === "MASTER_ADMIN" || roleStr === "Master Admin") {
    return new Set(["*"]);
  }

  // Company Admin possesses all company-level permissions by default
  if (roleStr === UserRole.COMPANY_ADMIN || roleStr === "COMPANY_ADMIN" || roleStr === "Company Admin") {
    const cachedAdmin = permissionCache.get(companyIdStr, "COMPANY_ADMIN", userIdStr);
    if (cachedAdmin) return cachedAdmin;
    const adminPerms = new Set(["*", "company.*"]);
    permissionCache.set(companyIdStr, "COMPANY_ADMIN", userIdStr, adminPerms);
    return adminPerms;
  }

  // Check fast in-memory cache
  const cached = permissionCache.get(companyIdStr, roleStr, userIdStr);
  if (cached) {
    return cached;
  }

  const granted = new Set<string>();

  // 1. Resolve Role from Database
  const roleQuery: any = { isDeleted: false };
  if (companyIdStr) {
    roleQuery.$or = [
      { companyId: user.companyId, roleCode: roleStr.toUpperCase() },
      { companyId: user.companyId, name: roleStr.toUpperCase() },
      { companyId: user.companyId, displayName: roleStr },
      { companyId: null, roleCode: roleStr.toUpperCase() },
    ];
  } else {
    roleQuery.$or = [{ roleCode: roleStr.toUpperCase() }, { name: roleStr.toUpperCase() }, { displayName: roleStr }];
  }

  const roleDoc = await Role.findOne(roleQuery).lean();
  if (roleDoc && roleDoc.status === "ACTIVE") {
    // Check dedicated RolePermission collection
    const rolePermissions = await RolePermission.find({
      roleId: roleDoc._id,
      status: RolePermissionStatus.ACTIVE,
      isDeleted: false,
    })
      .populate("permissionId")
      .lean();

    if (rolePermissions && rolePermissions.length > 0) {
      for (const rp of rolePermissions) {
        const perm: any = rp.permissionId;
        if (perm && !perm.isDeleted && perm.status === "ACTIVE") {
          const key = perm.permissionKey || perm.name;
          if (key) granted.add(key.toLowerCase());
        }
      }
    } else if (roleDoc.permissions && roleDoc.permissions.length > 0) {
      // Fallback to embedded permission IDs if RolePermission documents haven't been seeded yet
      const perms = await Permission.find({
        _id: { $in: roleDoc.permissions },
        isDeleted: false,
        status: PermissionStatus.ACTIVE,
      }).lean();
      for (const p of perms) {
        const key = p.permissionKey || p.name;
        if (key) granted.add(key.toLowerCase());
      }
    }
  }

  // 2. Evaluate UserPermission overrides (Highest Priority: Explicit User Permission -> Role -> Plan Feature -> System Policy)
  if (user._id || user.userId || user.id) {
    const targetId = user._id || user.userId || user.id;
    const now = new Date();
    const userPermissions = await UserPermission.find({
      userId: targetId,
      status: UserPermissionStatus.ACTIVE,
      isDeleted: false,
      $and: [
        { $or: [{ effectiveFrom: null }, { effectiveFrom: { $lte: now } }] },
        { $or: [{ effectiveUntil: null }, { effectiveUntil: { $gt: now } }, { expiresAt: null }, { expiresAt: { $gt: now } }] }
      ]
    })
      .populate("permissionId")
      .lean();

    for (const up of userPermissions) {
      const perm: any = up.permissionId;
      if (perm && !perm.isDeleted && perm.status === "ACTIVE") {
        const key = (perm.permissionKey || perm.name || "").toLowerCase();
        const isGranted = (up as any).allowed !== undefined ? (up as any).allowed : up.isGranted;
        if (isGranted === true) {
          granted.add(key);
        } else if (isGranted === false) {
          granted.delete(key);
          granted.delete("*"); // Explicit deny override overrides even wildcard privileges
        }
      }
    }
  }

  permissionCache.set(companyIdStr, roleStr, userIdStr, granted);
  return granted;
}

/**
 * Middleware to enforce that the authenticated user holds ALL specified permissions.
 */
export const requirePermission = (...requiredPermissions: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized - Authentication required.");
      }

      const grantedPermissions = await resolveUserPermissions(user);

      // Attach resolved permissions to request object for controller usage
      (req as any).userPermissions = Array.from(grantedPermissions);

      if (grantedPermissions.has("*")) {
        return next();
      }

      for (const reqPerm of requiredPermissions) {
        const lowerKey = reqPerm.toLowerCase();
        const modulePrefix = lowerKey.split(".")[0] + ".*";
        if (!grantedPermissions.has(lowerKey) && !grantedPermissions.has(modulePrefix)) {
          const reason = `Missing required permission (${reqPerm}).`;
          logPermissionViolation(req, reason);
          throw new ApiError(HTTP_STATUS.FORBIDDEN, `Access Denied: ${reason}`);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to enforce that the authenticated user holds AT LEAST ONE of the specified permissions.
 */
export const requireAnyPermission = (...allowedPermissions: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized - Authentication required.");
      }

      const grantedPermissions = await resolveUserPermissions(user);
      (req as any).userPermissions = Array.from(grantedPermissions);

      if (grantedPermissions.has("*")) {
        return next();
      }

      const hasAny = allowedPermissions.some((perm) => {
        const lowerKey = perm.toLowerCase();
        const modulePrefix = lowerKey.split(".")[0] + ".*";
        return grantedPermissions.has(lowerKey) || grantedPermissions.has(modulePrefix);
      });

      if (!hasAny) {
        const reason = `You require at least one of the following permissions: ${allowedPermissions.join(", ")}.`;
        logPermissionViolation(req, reason);
        throw new ApiError(HTTP_STATUS.FORBIDDEN, `Access Denied: ${reason}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
