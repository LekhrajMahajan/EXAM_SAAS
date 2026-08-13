import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import User from "../modules/auth/user.model";
import Branch from "../modules/branch/branch.model";
import { BranchSetupStatus } from "../modules/branch/branch.types";
import auditLogRepository from "../modules/audit-log/auditLog.repository";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

/**
 * Middleware 1: checkPasswordChange
 * Detects if a BRANCH_MANAGER is logging in for the first time with temporary credentials.
 * Enforces mandatory password change before permitting access to any standard routes or dashboard.
 */
export const checkPasswordChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== UserRole.BRANCH_MANAGER) {
      return next();
    }

    const path = req.originalUrl || req.path || "";

    // Allow authentication endpoints necessary to check status or perform password change
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

    // Check if forced password change flag is active or if password has never been changed
    const isChangeRequired = userDoc.forcePasswordChange === true || (!userDoc.passwordChangedAt && !userDoc.lastLogin);

    if (isChangeRequired) {
      // Audit log blocked attempt due to unexpired temporary credentials
      auditLogRepository.create({
        action: AuditAction.READ,
        module: "Branch Manager Security Guard",
        description: `Blocked access to ${path}: Mandatory initial password change enforced for Branch Manager (${userDoc.email})`,
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
          "Mandatory Security Requirement: You must change your temporary initial password before accessing any enterprise modules.",
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
 * Middleware 2: checkBranchSetup / requireBranchSetup
 * Enforces that a Branch Manager must complete the multi-step Branch Setup Wizard.
 * Restricts access to operational modules (exams, attendance, candidates, reports, etc.) until setupStatus is ACTIVE.
 */
export const checkBranchSetup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== UserRole.BRANCH_MANAGER) {
      return next();
    }

    const path = req.originalUrl || req.path || "";

    // Allow access to onboarding wizard APIs, authentication, sidebar navigation, and system lookup routes
    if (
      path.includes("/onboarding") ||
      path.includes("/api/v1/auth") ||
      path.includes("/api/v1/sidebar") ||
      path.includes("/api/v1/system-settings") ||
      path.includes("/api/v1/files")
    ) {
      return next();
    }

    // Resolve branch assigned to this Branch Manager
    const query: any[] = [];
    if (user.branchId) {
      query.push({ _id: user.branchId });
    }
    if (user.userId || user.id) {
      query.push({ branchManagerId: user.userId || user.id });
    }
    if (user.email) {
      query.push({ email: user.email.toLowerCase() });
    }

    const branch: any = await Branch.findOne({ $or: query, isDeleted: false }).select("branchName branchCode setupStatus setupCurrentStep status adminReviewRemarks").lean();

    if (!branch) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Access Denied: Your account is not currently linked to an operational branch profile.",
          { code: "BRANCH_UNLINKED" }
        )
      );
    }

    const status = branch.setupStatus || BranchSetupStatus.DRAFT;

    if (status !== BranchSetupStatus.ACTIVE) {
      let message = "Branch setup is mandatory. You must complete the Branch Setup Wizard before accessing operational enterprise modules.";
      let code = "BRANCH_SETUP_REQUIRED";

      if (status === BranchSetupStatus.PENDING_VERIFICATION) {
        message = "Branch setup is currently submitted and pending Company Admin verification. Operational access is restricted until official verification and approval.";
        code = "BRANCH_SETUP_PENDING";
      } else if (status === BranchSetupStatus.REJECTED) {
        message = `Branch setup was reviewed and required revision by Company Admin (${branch.adminReviewRemarks || "Corrections needed"}). Please correct and resubmit the setup wizard before accessing operational modules.`;
        code = "BRANCH_SETUP_REJECTED";
      }

      return next(
        new ApiError(HTTP_STATUS.FORBIDDEN, message, {
          requireBranchSetup: true,
          setupStatus: status,
          setupCurrentStep: branch.setupCurrentStep || 1,
          code,
        })
      );
    }

    // Attach resolved branch to request for downstream handlers
    (req as any).activeBranch = branch;
    next();
  } catch (error) {
    next(error);
  }
};

export const BranchManagerGuard = [checkPasswordChange, checkBranchSetup];
export default BranchManagerGuard;
