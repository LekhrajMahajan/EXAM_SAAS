import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import companyRepository from "../modules/company/company.repository";
import Plan from "../modules/plan/plan.model";
import { IPlanFeatures } from "../modules/plan/plan.types";
import { UserRole } from "../constants/roles";
import auditLogService from "../modules/audit-log/auditLog.service";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

function logFeatureViolation(req: Request, reason: string): void {
  try {
    const user: any = req.user || {};
    auditLogService.log({
      actorId: user._id?.toString() || user.id || "unauthorized_user",
      actorEmail: user.email || "anonymous@system.local",
      actorRole: user.role || "UNKNOWN",
      action: AuditAction.REJECT,
      module: "Subscription / Plan Features",
      targetResource: req.baseUrl || req.path || "API",
      description: `Feature Gating Alert: ${reason}`,
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
 * Middleware to check if the company's subscription plan has a specific feature enabled.
 * Master Admins bypass this check.
 * 
 * @param featureKey - The feature key from IPlanFeatures (e.g., 'questionBank')
 */
export const requireFeature = (featureKey: keyof IPlanFeatures) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // Master admins bypass feature checks (they have access to everything)
      if (user?.role === UserRole.MASTER_ADMIN) {
        return next();
      }

      // If user is candidate, we might need to check their company's feature too.
      // Assuming all users (company admins, staff, candidates) have a companyId.
      if (!user?.companyId) {
        return next(new ApiError(HTTP_STATUS.FORBIDDEN, "User does not belong to a company."));
      }

      const company = await companyRepository.findById(user.companyId);

      if (!company) {
        return next(new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found."));
      }

      // Check if subscription is active
      if (!company.subscriptionEndDate || new Date(company.subscriptionEndDate) < new Date()) {
        return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Active subscription required."));
      }

      // Fetch the plan
      const plan = await Plan.findOne({ planCode: company.subscriptionPlan });

      if (!plan) {
        return next(new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription plan not found."));
      }

      // Check feature flag
      if (plan.features[featureKey] !== true) {
        const reason = `Feature (${String(featureKey)}) is not included in current subscription plan (${plan.planName}).`;
        logFeatureViolation(req, reason);
        return next(new ApiError(HTTP_STATUS.FORBIDDEN, reason));
      }

      // Feature is enabled, attach plan to request for downstream middlewares if needed
      (req as any).companyPlan = plan;

      next();
    } catch (error) {
      next(error);
    }
  };
};
