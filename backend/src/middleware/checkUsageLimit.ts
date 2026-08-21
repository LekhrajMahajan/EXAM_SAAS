import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import companyRepository from "../modules/company/company.repository";
import Plan from "../modules/plan/plan.model";
import { IPlanUsageLimits } from "../modules/plan/plan.types";
import { UserRole } from "../constants/roles";
import auditLogService from "../modules/audit-log/auditLog.service";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

function logLimitViolation(req: Request, reason: string): void {
  try {
    const user: any = req.user || {};
    auditLogService.log({
      actorId: user._id?.toString() || user.id || "unauthorized_user",
      actorEmail: user.email || "anonymous@system.local",
      actorRole: user.role || "UNKNOWN",
      action: AuditAction.REJECT,
      module: "Subscription / Usage Limits",
      targetResource: req.baseUrl || req.path || "API",
      description: `Usage Limit Alert: ${reason}`,
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

/**
 * Middleware to check if creating a new resource exceeds the company's plan usage limit.
 * Master Admins bypass this check.
 * 
 * @param limitKey - The usage limit key from IPlanUsageLimits (e.g., 'maxCenters')
 * @param model - The Mongoose Model to count current usage against (e.g., Branch)
 * @param queryField - The field to filter by company ID (default: 'companyId')
 */
export const checkUsageLimit = (
  limitKey: keyof IPlanUsageLimits,
  model: mongoose.Model<any>,
  queryField: string = "companyId"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // Master admins bypass limits
      if (user?.role === UserRole.MASTER_ADMIN) {
        return next();
      }

      if (!user?.companyId) {
        return next(new ApiError(HTTP_STATUS.FORBIDDEN, "User does not belong to a company."));
      }

      // Check if we already fetched the plan in an earlier middleware (e.g., requireFeature)
      let plan = (req as any).companyPlan;

      if (!plan) {
        const company = await companyRepository.findById(user.companyId);
        if (!company) {
          return next(new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found."));
        }

        if (!company.subscriptionEndDate || new Date(company.subscriptionEndDate) < new Date()) {
          return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Active subscription required."));
        }

        plan = await Plan.findOne({ planCode: company.subscriptionPlan });
        if (!plan) {
          return next(new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription plan not found."));
        }

        (req as any).companyPlan = plan; // Cache it on the request
      }

      // Validate the limit
      const limitValue = plan.usageLimits[limitKey] as number;

      // Some limits like '0' might mean disabled feature or unlimited. 
      // Assuming 0 means none allowed in this context, except unlimited we might define as -1.
      if (limitValue === 0) {
        return next(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            `Your current subscription plan (${plan.planName}) does not allow this resource.`
          )
        );
      }
      
      if (limitValue !== -1) { // Assuming -1 is unlimited
        // Check current usage
        const query = { [queryField]: user.companyId };
        const currentCount = await model.countDocuments(query);

        if (currentCount >= limitValue) {
          const reason = `Maximum limit (${limitValue}) reached for ${String(limitKey)} on the ${plan.planName} plan.`;
          logLimitViolation(req, reason);
          return next(new ApiError(HTTP_STATUS.FORBIDDEN, reason));
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
