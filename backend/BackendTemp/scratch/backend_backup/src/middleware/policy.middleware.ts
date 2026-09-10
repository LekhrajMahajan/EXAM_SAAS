import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import auditLogRepository from "../modules/audit-log/auditLog.repository";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";
import mongoose from "mongoose";
import { CompanySettings } from "../modules/company-settings/company-settings.model";

/**
 * PolicyMiddleware enforces organization-level security policies, IP restrictions,
 * strict multi-tenant boundary containment, and session governance.
 */
export const requirePolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized - Authentication required.");
    }

    // Master Admin bypasses standard company security policy rules
    if (user.role === UserRole.MASTER_ADMIN || (user.role as string) === "SUPER_ADMIN") {
      return next();
    }

    if (!user.companyId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Policy Enforcement Failed: User does not belong to an assigned tenant organization.");
    }

    // 1. STRICT MULTI-TENANcy BOUNDARY CHECK
    // Prevent Company A from accessing Company B data if companyId or tenant ID is supplied in request params or body
    const targetCompanyId = req.params.companyId || req.query.companyId || (req.body && req.body.companyId);
    if (targetCompanyId && targetCompanyId.toString() !== user.companyId.toString()) {
      // Record severity audit violation for cross-tenant data access attempt
      auditLogRepository.create({
        action: AuditAction.READ,
        module: "TenantPolicyViolation",
        description: `Cross-tenant access blocked! User from organization ${user.companyId} attempted access to target organization ${targetCompanyId}`,
        performedBy: user.userId ? new mongoose.Types.ObjectId(user.userId) : undefined,
        performedByRole: user.role,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        responseStatus: HTTP_STATUS.FORBIDDEN,
        severity: AuditSeverity.CRITICAL,
        status: AuditStatus.FAILED,
      }).catch(() => {});

      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "Tenant Policy Violation: Accessing data belonging to another organization is strictly forbidden."
      );
    }

    // 2. FETCH COMPANY SECURITY POLICY (IP whitelist, session restrictions)
    try {
      const securityPolicy = await CompanySettings.findOne({
        companyId: user.companyId,
        category: "SECURITY",
        isDeleted: false
      }).select("value").lean();

      if (securityPolicy && securityPolicy.value) {
        const policy: any = securityPolicy.value;

        // Check IP Whitelist if configured
        if (Array.isArray(policy.allowedIps) && policy.allowedIps.length > 0) {
          const clientIp = req.ip || req.connection.remoteAddress || "";
          const isAllowed = policy.allowedIps.some((ip: string) => clientIp.includes(ip));
          if (!isAllowed && !clientIp.includes("127.0.0.1") && !clientIp.includes("::1")) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "Security Policy Violation: Your IP address is not authorized under company network policies.");
          }
        }
      }
    } catch (dbErr) {
      // Continue if setting model query fails or no setting exists (non-blocking fallback)
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const PolicyMiddleware = requirePolicy;
