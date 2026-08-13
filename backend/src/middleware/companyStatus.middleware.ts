import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import Company from "../modules/company/company.model";
import auditLogRepository from "../modules/audit-log/auditLog.repository";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";
import mongoose from "mongoose";

/**
 * CompanyStatusMiddleware ensures that the tenant organization is active and operational.
 * Rejects requests with 423 (Locked) or 403 (Forbidden) if the company account is disabled or suspended.
 */
export const requireCompanyStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized - Authentication required.");
    }

    // Master Admin bypasses company status restriction
    if (user.role === UserRole.MASTER_ADMIN || (user.role as string) === "SUPER_ADMIN") {
      return next();
    }

    if (!user.companyId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Access Denied: User is not associated with an active company.");
    }

    // Use cached company status on request if available from previous middlewares
    let company = (req as any).tenantCompany;
    if (!company) {
      company = await Company.findById(user.companyId).select("status paymentStatus isDeleted name lockReason").lean();
      if (!company) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Associated tenant company not found.");
      }
      (req as any).tenantCompany = company;
    }

    // Check if organization is marked deleted or disabled
    if (company.isDeleted || company.status === false || company.status === "INACTIVE") {
      // Audit log the blocked access attempt
      auditLogRepository.create({
        action: AuditAction.READ,
        module: "CompanySecurity",
        description: `Access attempted on disabled company (${company.name || user.companyId})`,
        performedBy: user.userId ? new mongoose.Types.ObjectId(user.userId) : undefined,
        performedByRole: user.role,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        responseStatus: 423,
        severity: AuditSeverity.HIGH,
        status: AuditStatus.FAILED,
      }).catch(() => {});

      // 423 Locked status for disabled or locked organizations
      return next(new ApiError(423 as any, `Company Locked: Organization account is disabled or suspended. ${company.lockReason || "Please contact administrative support."}`));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const CompanyStatusMiddleware = requireCompanyStatus;
