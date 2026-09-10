import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import User from "../modules/auth/user.model";
import Center from "../modules/center/center.model";
import { CenterSetupStatus } from "../modules/center/center.types";
import auditLogRepository from "../modules/audit-log/auditLog.repository";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

/**
 * Middleware 1: checkCenterPasswordChange
 * Detects if a CENTER_MANAGER is logging in for the first time with temporary credentials.
 * Enforces mandatory password change before permitting access to operational modules.
 */
export const checkCenterPasswordChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== UserRole.CENTER_MANAGER) {
      return next();
    }

    const path = req.originalUrl || req.path || "";

    if (
      path.includes("/api/v1/auth/change-password") ||
      path.includes("/api/v1/auth/me") ||
      path.includes("/api/v1/auth/logout") ||
      path.includes("/api/v1/auth/refresh") ||
      path.includes("/api/v1/sidebar") ||
      path.includes("/api/v1/system-settings")
    ) {
      return next();
    }

    const userDoc: any = await User.findById(user.userId || user.id).select("forcePasswordChange passwordChangedAt lastLogin role email").lean();
    if (!userDoc) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User account not found.");
    }

    const isChangeRequired = userDoc.forcePasswordChange === true || (!userDoc.passwordChangedAt && !userDoc.lastLogin);

    if (isChangeRequired) {
      auditLogRepository.create({
        action: AuditAction.READ,
        module: "Center Manager Security Guard",
        description: `Blocked access to ${path}: Mandatory initial password change enforced for Center Manager (${userDoc.email})`,
        performedBy: userDoc._id ? new mongoose.Types.ObjectId(userDoc._id.toString()) : undefined,
        performedByRole: userDoc.role,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestMethod: req.method,
        requestUrl: path,
        responseStatus: HTTP_STATUS.FORBIDDEN,
        severity: AuditSeverity.MEDIUM,
        status: AuditStatus.FAILED,
      }).catch(() => {});

      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Mandatory Security Requirement: You must change your temporary initial password before accessing any enterprise center operations.",
          { forcePasswordChange: true, code: "PASSWORD_CHANGE_REQUIRED" }
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware 2: checkCenterSetup
 * Enforces that a Center Manager must complete the mandatory 8-step Center Setup Wizard.
 * Restricts operational access (shift planning, infrastructure modifications, exam allocations) until setupStatus is ACTIVE.
 */
export const checkCenterSetup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== UserRole.CENTER_MANAGER) {
      return next();
    }

    const path = req.originalUrl || req.path || "";

    // Allow access to onboarding wizard APIs, authentication, sidebar navigation, file uploads and settings
    if (
      path.includes("/onboarding") ||
      path.includes("/commercial-agreement") ||
      path.includes("/api/v1/auth") ||
      path.includes("/api/v1/sidebar") ||
      path.includes("/api/v1/system-settings") ||
      path.includes("/api/v1/files")
    ) {
      return next();
    }

    const query: any[] = [];
    if (user.centerId) {
      query.push({ _id: user.centerId });
    }
    if (user.userId || user.id) {
      query.push({ centerManagerId: user.userId || user.id });
    }
    if (user.email) {
      query.push({ email: user.email.toLowerCase() });
    }

    const center: any = await Center.findOne({ $or: query, isDeleted: false })
      .select("centerName centerCode setupStatus setupCurrentStep status adminReviewRemarks")
      .lean();

    if (!center) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Access Denied: Your account is not linked to an operational center profile.",
          { code: "CENTER_UNLINKED" }
        )
      );
    }

    const status = center.setupStatus || CenterSetupStatus.DRAFT;

    if (status !== CenterSetupStatus.ACTIVE) {
      let message = "Center setup is mandatory. You must complete the 8-step Center Onboarding Wizard before operating exam shift sessions or facilities.";
      let code = "CENTER_SETUP_REQUIRED";

      if (status === CenterSetupStatus.PENDING_VERIFICATION) {
        message = "Center setup is currently submitted and pending Company Admin document verification. Operational access is restricted until official verification and approval.";
        code = "CENTER_SETUP_PENDING";
      } else if (status === CenterSetupStatus.REJECTED) {
        message = `Center setup was reviewed and required revision by Company Admin (${center.adminReviewRemarks || "Corrections required on uploaded legal documents"}). Please amend and resubmit the wizard before accessing operational modules.`;
        code = "CENTER_SETUP_REJECTED";
      }

      return next(
        new ApiError(HTTP_STATUS.FORBIDDEN, message, {
          requireCenterSetup: true,
          centerSetupStatus: status,
          centerSetupCurrentStep: center.setupCurrentStep || 1,
          code,
        })
      );
    }

    (req as any).activeCenter = center;
    next();
  } catch (error) {
    next(error);
  }
};

export const CenterManagerGuard = [checkCenterPasswordChange, checkCenterSetup];
export default CenterManagerGuard;
