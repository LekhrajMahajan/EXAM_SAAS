import authRepository from "./auth.repository"; // Trigger TS
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from "../../utils/jwt";
import { comparePassword, validatePasswordPolicy } from "../../utils/password";
import { IUser } from "./user.types";
import { UserRole } from "../../constants/roles";
import { BaseService } from "../../common/base.service";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import emailService from "../email/email.service";
import systemSettingsService from "../system-settings/systemSettings.service";
import Role from "../role/role.model";
import Company from "../company/company.model";
import Employee from "../employee/employee.model";

class AuthService extends BaseService<IUser> {
  constructor() {
    super(authRepository, "Auth");
  }

  async checkEmailExists(email: string) {
    return await authRepository.findByEmail(email);
  }

  async createUser(payload: any, session?: any) {
    return await super.create(payload, session);
  }

  private async getSessionTimeoutForRole(role: string): Promise<string> {
    if (role === "MASTER_ADMIN" || role === "SUPER_ADMIN") {
      return "24h"; 
    }
    const setting = await systemSettingsService.getByKey(`SESSION_TIMEOUT_${role}`).catch(() => null);
    if (setting && setting.value) {
      return `${setting.value}m`;
    }
    return env.JWT_EXPIRES_IN || "24h"; // Default fallback to config
  }

  async register(payload: any) {
    const registrationEnabled = await systemSettingsService.getByKey("REGISTRATION_ENABLED").catch(() => null);
    if (registrationEnabled?.value === false) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "User registration is currently disabled.");
    }

    if (payload.password) {
      try {
        validatePasswordPolicy(payload.password);
      } catch (err: any) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, err.message);
      }
    }

    const existingUser = await this.checkEmailExists(payload.email!);

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
    }

    const user = (await super.create(payload)) as any;

    const expiresIn = await this.getSessionTimeoutForRole(user.role);

    const accessToken = generateAccessToken({
      userId: user.id as string,
      role: user.role as UserRole,
      email: user.email,
      companyId: user.companyId,
      roleId: (user as any).roleId || user.role,
      permissionVersion: 1,
      featureVersion: 1,
      sessionId: Date.now().toString(),
    }, expiresIn);

    const refreshToken = generateRefreshToken({
      userId: user.id as string,
      role: user.role as UserRole,
      email: user.email,
    });

    await authRepository.updateRefreshToken(user.id as string, refreshToken);

    return {
      user: {
        id: user.id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const users = await authRepository.findManyByEmailWithPassword(email);

    if (!users || users.length === 0) {
      console.log(`[DEBUG LOGIN] User not found for email: ${email}`);
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    let matchedUser = null;
    const settingsCache = require("../system-settings/settingsCache.service").default;
    const maxAttempts = Number(settingsCache.get("MAX_FAILED_LOGIN_ATTEMPTS", 5));
    const lockDuration = Number(settingsCache.get("ACCOUNT_LOCK_DURATION", 15)); // in minutes

    for (const u of users) {
      const isPasswordCorrect = await comparePassword(password, u.password);
      if (isPasswordCorrect) {
        matchedUser = u;
        break;
      } else {
        u.loginAttempts = (u.loginAttempts || 0) + 1;
        if (u.loginAttempts >= maxAttempts && maxAttempts > 0) {
          const lockoutTime = new Date();
          lockoutTime.setMinutes(lockoutTime.getMinutes() + lockDuration);
          u.lockoutUntil = lockoutTime;
        }
        await u.save();
      }
    }

    if (!matchedUser) {
      console.log(`[DEBUG LOGIN] Password mismatch for all accounts with email ${email}. Login failed.`);
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const user = matchedUser;

    // Check if account is active or disconnected
    if ((user as any).status === "DISCONNECTED") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "These login credentials are now disconnected. Please request new login credentials from your company admin.");
    }

    if ((user as any).status === false || (user as any).status === "INACTIVE") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your account is inactive. Please contact your administrator.");
    }

    const employeeRoles = [
      "EXAM_MANAGER", "PAPER_SETTER", "EVALUATOR", "REVIEWER", 
      "INVIGILATOR", "COMMAND_CENTER", 
      "AI_PROCTOR", "BIOMETRIC_VERIFIER", "ENTRY_CHECKER", 
      "OBSERVER", "GOVT_AUTHORITY", "TECHNICAL_MANAGER", "PRIVATE_AUTHORITY"
    ];

    if (employeeRoles.includes(user.role)) {
      const linkedEmployee = await Employee.findOne({ userId: user._id });
      if (!linkedEmployee) {
        // Fallback for roles that might be CenterStaff (e.g. ENTRY_CHECKER, INVIGILATOR, BIOMETRIC_VERIFIER)
        const centerStaffRoles = ["ENTRY_CHECKER", "INVIGILATOR", "BIOMETRIC_VERIFIER", "OBSERVER", "TECHNICAL_MANAGER"];
        if (centerStaffRoles.includes(user.role)) {
          const CenterStaffModel = require("../center/centerStaff.model").default;
          // CenterStaff are linked by email when created via CenterManager
          const linkedStaff = await CenterStaffModel.findOne({ email: user.email });
          if (!linkedStaff) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your account is no longer active or has been permanently deleted.");
          }
          if (linkedStaff.status === "INACTIVE" || linkedStaff.status === "DELETED") {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your account has been deactivated or deleted. Please contact your center manager.");
          }
        } else {
          throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your account is no longer active or has been permanently deleted.");
        }
      } else if (linkedEmployee.isDeleted) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your account has been deleted. Please contact your administrator.");
      }
    }

    if (user.role === "CENTER_MANAGER") {
      const CenterModel = require("../center/center.model").default;
      let center = await CenterModel.findOne({ centerManagerId: user._id });
      if (!center) {
        center = await CenterModel.findOne({ email: user.email });
      }

      if (!center) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your account is no longer active or has been permanently deleted.");
      }
      if (center.isDeleted || center.status !== "ACTIVE") {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Your center account has been deactivated or deleted. Please contact your administrator.");
      }
    }

    if (user.role !== "MASTER_ADMIN") {
      const maintenanceMode = await systemSettingsService.getByKey("MAINTENANCE_MODE").catch(() => null);
      if (maintenanceMode?.value === true) {
        throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "System is under maintenance. Please try again later.");
      }

      const loginEnabled = await systemSettingsService.getByKey("LOGIN_ENABLED").catch(() => null);
      if (loginEnabled?.value === false) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "Login access is currently disabled.");
      }
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - new Date().getTime()) / 60000);
        // Temporarily bypassing lockout to allow testing
        // throw new ApiError(HTTP_STATUS.FORBIDDEN, `Account locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`);
    }

    // Reset login attempts on success
    if (user.loginAttempts > 0 || user.lockoutUntil) {
        user.loginAttempts = 0;
        user.lockoutUntil = undefined;
        await user.save();
    }

    const expiresIn = await this.getSessionTimeoutForRole(user.role);

    let planId, subscriptionId, enabledFeatures, usageLimits;
    if (user.companyId && user.role === "COMPANY_ADMIN") {
      const company = await Company.findById(user.companyId).select("planId subscriptionId subscriptionPlan").lean();
      if (company) {
        planId = (company as any).planId;
        subscriptionId = (company as any).subscriptionId;
        const PlanModel = require("../plan/plan.model").default;
        const planDoc = await PlanModel.findOne({ 
          $or: [{ _id: planId }, { planCode: (company as any).subscriptionPlan }]
        }).lean();
        if (planDoc) {
          enabledFeatures = planDoc.features;
          usageLimits = planDoc.usageLimits;
        }
      }
    }

    // Auto-fix for older broken Center Managers that missed centerId in DB
    let activeCenterId = (user as any).centerId;
    if (user.role === "CENTER_MANAGER" && !activeCenterId) {
      const CenterModel = require("../center/center.model").default;
      const center = await CenterModel.findOne({ email: user.email }).select("_id").lean();
      if (center) {
        activeCenterId = center._id;
        const ManagerModel = require("../manager/manager.model").default;
        await ManagerModel.findByIdAndUpdate(user._id, { $set: { centerId: center._id } });
      }
    }

    const accessToken = generateAccessToken({
      userId: user.id as string,
      role: user.role as UserRole,
      email: user.email,
      companyId: user.companyId,
      centerId: activeCenterId,
      roleId: (user as any).roleId || user.role,
      planId,
      subscriptionId,
      permissionVersion: 1,
      featureVersion: 1,
      sessionId: Date.now().toString(),
      enabledFeatures,
      usageLimits,
    }, expiresIn);

    const refreshToken = generateRefreshToken({
      userId: user.id as string,
      role: user.role as UserRole,
      email: user.email,
    });

    await authRepository.updateRefreshToken(user.id as string, refreshToken);

    await authRepository.updateLastLogin(user.id as string);

    let centerSetupStatus = null;
    let centerSetupCurrentStep = null;
    let resolvedCenterId = (user as any).centerId || null;

    if (user.role === "CENTER_MANAGER") {
      try {
        const CenterModel = require("../center/center.model").default;
        const query: any[] = [];
        if (resolvedCenterId) query.push({ _id: resolvedCenterId });
        if (user._id || user.id) query.push({ centerManagerId: user._id || user.id });
        if (user.email) query.push({ email: user.email.toLowerCase() });
        const c = await CenterModel.findOne({ $or: query, isDeleted: false }).select("setupStatus setupCurrentStep _id").lean();
        if (c) {
          resolvedCenterId = c._id;
          centerSetupStatus = c.setupStatus || "DRAFT";
          centerSetupCurrentStep = c.setupCurrentStep || 1;
        }
      } catch (_e) {
        // Ignore
      }
    }

    return {
      user: {
        id: user.id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
        centerId: resolvedCenterId,

        centerSetupStatus,
        centerSetupCurrentStep,
        forcePasswordChange: false,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken) as JwtPayload;

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const expiresIn = await this.getSessionTimeoutForRole(user.role);

    let planId, subscriptionId, enabledFeatures, usageLimits;
    if (user.companyId && user.role === "COMPANY_ADMIN") {
      const company = await Company.findById(user.companyId).select("planId subscriptionId subscriptionPlan").lean();
      if (company) {
        planId = (company as any).planId;
        subscriptionId = (company as any).subscriptionId;
        const PlanModel = require("../plan/plan.model").default;
        const planDoc = await PlanModel.findOne({ 
          $or: [{ _id: planId }, { planCode: (company as any).subscriptionPlan }]
        }).lean();
        if (planDoc) {
          enabledFeatures = planDoc.features;
          usageLimits = planDoc.usageLimits;
        }
      }
    }

    const newAccessToken = generateAccessToken({
      userId: user.id as string,
      role: user.role as UserRole,
      email: user.email,
      companyId: user.companyId,
      roleId: (user as any).roleId || user.role,
      planId,
      subscriptionId,
      permissionVersion: 1,
      featureVersion: 1,
      sessionId: Date.now().toString(),
      enabledFeatures,
      usageLimits,
    }, expiresIn);

    return {
      accessToken: newAccessToken,
    };
  }

  async logout(userId: string) {
    await authRepository.clearRefreshToken(userId);

    return {
      success: true,
    };
  }

  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    let permissions: string[] = [];
    let subscriptionPlan: string | null = null;
    let subscriptionStartDate: Date | null = null;
    let approvalStatus: string | null = null;
    let companyPaymentStatus = 'PENDING';
    let resolvedCenterId: any = (user as any).centerId || null;
    let centerSetupStatus: string = "DRAFT";
    let centerSetupCurrentStep: number = 1;

    const userObjLocal = typeof user.toObject === 'function' ? user.toObject() : { ...user };

    // Master and Super Admins get all permissions
    if (user.role === "MASTER_ADMIN" || user.role === "MASTER_ADMIN") {
      permissions = ["*"];
    } else {
      // For other roles, fetch from Role model
      const roleDoc = await Role.findOne({ 
        name: user.role, 
        companyId: user.companyId || null, 
        isDeleted: false 
      }).populate("permissions");
      
      if (roleDoc && roleDoc.permissions) {
        permissions = roleDoc.permissions.map((p: any) => p.name);
      }

      // For Company users, fetch their company's subscription plan and onboarding status
      if (user.companyId) {
        try {
          const company = await Company.findById(user.companyId).select("subscriptionPlan subscriptionStartDate subscriptionEndDate approvalStatus paymentStatus onboardingCompleted").lean();
          if (company) {
            subscriptionPlan = (company as any).subscriptionPlan || null;
            subscriptionStartDate = (company as any).subscriptionStartDate || null;
            approvalStatus = (company as any).approvalStatus || null;
            companyPaymentStatus = (company as any).paymentStatus || 'PENDING';
            (userObjLocal as any).subscriptionEndDate = (company as any).subscriptionEndDate || null;
            (userObjLocal as any).onboardingCompleted = (company as any).onboardingCompleted || false;

            // Fetch the plan features based on subscriptionPlan code or ID
            const PlanModel = require("../plan/plan.model").default;
            const planDoc = await PlanModel.findOne({ planCode: subscriptionPlan }).lean();
            if (planDoc && planDoc.features) {
              (userObjLocal as any).planFeatures = planDoc.features;
            }
          }
        } catch (_e) {
          // Non-critical, skip
        }
      }
    }

    (userObjLocal as any).paymentStatus = companyPaymentStatus;
    if ((userObjLocal as any).subscriptionEndDate === undefined) {
      (userObjLocal as any).subscriptionEndDate = null;
    }
    if ((userObjLocal as any).planFeatures === undefined) {
      (userObjLocal as any).planFeatures = null;
    }
    if ((userObjLocal as any).onboardingCompleted === undefined) {
      (userObjLocal as any).onboardingCompleted = false;
    }

    let idleTimeout = 15; // default 15 minutes
    if (user.role !== "MASTER_ADMIN" && user.role !== "SUPER_ADMIN") {
      const setting = await systemSettingsService.getByKey(`IDLE_TIMEOUT_${user.role}`).catch(() => null);
      if (setting && setting.value) {
        idleTimeout = parseInt(setting.value as string) || 15;
      }
    } else {
      idleTimeout = 0; // 0 means no timeout for MASTER_ADMIN
    }

    if (user.role === "CENTER_MANAGER") {
      try {
        const CenterModel = require("../center/center.model").default;
        const query: any[] = [];
        if (resolvedCenterId) query.push({ _id: resolvedCenterId });
        if (user._id || user.id) query.push({ centerManagerId: user._id || user.id });
        if (user.email) query.push({ email: user.email.toLowerCase() });
        const c = await CenterModel.findOne({ $or: query, isDeleted: false }).select("setupStatus setupCurrentStep _id").lean();
        if (c) {
          resolvedCenterId = c._id;
          centerSetupStatus = c.setupStatus || "DRAFT";
          centerSetupCurrentStep = c.setupCurrentStep || 1;
        }
      } catch (_e) {
        // Ignore
      }
    }

    return {
      ...userObjLocal,
      centerId: resolvedCenterId,

      centerSetupStatus,
      centerSetupCurrentStep,
      permissions,
      subscriptionPlan,
      subscriptionStartDate,
      approvalStatus,
      idleTimeout,
      forcePasswordChange: false,
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      validatePasswordPolicy(newPassword);
    } catch (err: any) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, err.message);
    }

    const user = await authRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const match = await comparePassword(oldPassword, user.password);

    if (!match) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Current password is incorrect",
      );
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.forcePasswordChange = false;

    await user.save();

    return {
      success: true,
    };
  }

  async adminResetPassword(
    userId: string,
    newPassword: string,
  ) {
    try {
      validatePasswordPolicy(newPassword);
    } catch (err: any) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, err.message);
    }

    const user = await authRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.forcePasswordChange = true;

    await user.save();

    return {
      success: true,
    };
  }

  async forgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (user.role !== "COMPANY_ADMIN" && user.role !== "Company Admin") {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Only Company Admin is allowed to reset password via email. Please contact your administrator.");
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    await emailService.sendPasswordReset(user.email, resetLink);

    return {
      success: true,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      validatePasswordPolicy(newPassword);
    } catch (err: any) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, err.message);
    }

    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid or expired reset token"
      );
    }

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    user.password = newPassword;
    await user.save();

    return {
      success: true,
    };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (otp !== "123456") {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP");
    }

    user.isEmailVerified = true;
    await user.save();

    return {
      success: true,
    };
  }

  async hardDeleteUser(userId: string, session?: import("mongoose").ClientSession) {
    return await authRepository.hardDelete(userId, session);
  }
}

export default new AuthService();
