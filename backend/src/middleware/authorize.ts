import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import auditLogService from "../modules/audit-log/auditLog.service";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

/**
 * Helper to asynchronously record denied authorization attempts
 */
function logSecurityViolation(req: Request, reason: string): void {
  try {
    const user: any = req.user || {};
    auditLogService.log({
      actorId: user._id?.toString() || user.id || "unauthorized_user",
      actorEmail: user.email || "anonymous@system.local",
      actorRole: user.role || "UNKNOWN",
      action: AuditAction.REJECT,
      module: "RBAC / Authorization",
      targetResource: req.baseUrl || req.path || "API",
      description: `Security Alert: ${reason}`,
      companyId: user.companyId || undefined,
      status: AuditStatus.FAILED,
      severity: AuditSeverity.HIGH,
      ip: req.ip || req.socket?.remoteAddress || "0.0.0.0",
      userAgent: req.headers["user-agent"] || "UNKNOWN",
      metadata: { path: req.originalUrl, method: req.method, reason },
    } as any).catch(() => {});
  } catch {
    // Suppress secondary errors during logging
  }
}

/**
 * Normalizes role string representation (e.g. "COMPANY_ADMIN" <-> "Company Admin")
 */
function normalizeRole(role: string): string {
  if (!role) return "";
  const upper = role.toUpperCase().replace(/\s+/g, "_");
  if (upper === "SUPER_ADMIN" || upper === "MASTER_ADMIN" || upper === "MASTER ADMIN") return UserRole.MASTER_ADMIN;
  if (upper === "COMPANY_ADMIN" || upper === "COMPANY ADMIN") return UserRole.COMPANY_ADMIN;
  if (upper === "CANDIDATE") return UserRole.CANDIDATE;
  return upper;
}

/**
 * Authorize middleware ensuring user matches one of the allowed roles.
 * Supports flexible normalization and custom role codes.
 */
export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized - Authentication required.");
    }

    const userRoleNormalized = normalizeRole(req.user.role);

    // Master Admin always has universal authorization
    if (userRoleNormalized === UserRole.MASTER_ADMIN || userRoleNormalized === "MASTER_ADMIN") {
      return next();
    }

    const allowedNormalized = roles.map(normalizeRole);
    if (!allowedNormalized.includes(userRoleNormalized) && !roles.includes(req.user.role)) {
      const reason = `Role (${req.user.role}) lacks authorization for this endpoint. Required: ${roles.join(", ")}`;
      logSecurityViolation(req, reason);
      throw new ApiError(HTTP_STATUS.FORBIDDEN, `Access Denied: ${reason}`);
    }

    next();
  };

/**
 * Authorize by minimum hierarchy level (0 = Master Admin, 1 = Branch Manager, ..., 14 = Candidate).
 * Lower numbers signify higher administrative privilege.
 */
export const authorizeMinHierarchyLevel = (maxLevel: number) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized"));
    }

    const userRoleNormalized = normalizeRole(req.user.role);
    if (userRoleNormalized === UserRole.MASTER_ADMIN || userRoleNormalized === UserRole.COMPANY_ADMIN) {
      return next();
    }

    const level = (req.user as any).hierarchyLevel;
    if (typeof level !== "number" || level > maxLevel) {
      const reason = `Requires administrative hierarchy tier ${maxLevel} or higher (current: ${level}).`;
      logSecurityViolation(req, reason);
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Access Denied: ${reason}`
        )
      );
    }

    next();
  };
};
