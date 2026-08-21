import { Types } from "mongoose";
import Company from "../company/company.model";
import Role from "../role/role.model";
import Permission from "../permission/permission.model";
import RolePermission, { RolePermissionStatus } from "../role-permission/rolePermission.model";
import sidebarService from "../sidebar/sidebar.service";
import Plan from "../plan/plan.model";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction, AuditSeverity } from "../audit-log/auditLog.types";
import { RoleStatus } from "../role/role.types";
import {
  CompanySettings,
  BrandingSettings,
  SMTPSettings,
  SecuritySettings,
  NotificationSettings,
  AuditSettings,
  StorageSettings,
  TenantSystemSettings,
} from "../company-settings/company-settings.model";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

interface OnboardingWizardData {
  companyInfo: {
    companyName?: string;
    legalName?: string;
    companyCode?: string;
    email?: string;
    supportEmail?: string;
    phone?: string;
    alternatePhone?: string;
    website?: string;
    timezone?: string;
    currency?: string;
    language?: string;
  };
  address: {
    country?: string;
    state?: string;
    district?: string;
    city?: string;
    pincode?: string;
    street?: string;
  };
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    theme?: "light" | "dark" | "system";
    companyLogo?: string;
    loginLogo?: string;
    favicon?: string;
    isEnabled?: boolean;
  };
  smtp?: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    encryption?: "TLS" | "SSL" | "NONE";
    senderName?: string;
    senderEmail?: string;
    isVerified?: boolean;
    isEnabled?: boolean;
  };
  systemPreferences?: {
    academicYear?: string;
    financialYear?: string;
    dateFormat?: string;
    timeFormat?: "12H" | "24H";
    weekStart?: "Monday" | "Sunday" | "Saturday";
    sessionTimeout?: number;
    passwordPolicy?: any;
  };
}

export class OnboardingService {
  /**
   * Completes the multi-step onboarding wizard and executes automated tenant initialization
   */
  async completeOnboarding(companyId: string, userId: string, data: OnboardingWizardData, reqMeta: any = {}) {
    const compId = new Types.ObjectId(companyId);
    const usrId = new Types.ObjectId(userId);

    const company = await Company.findById(compId);
    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company tenant not found.");
    }

    // Fetch Plan features to enforce SaaS limits on initial settings
    let planFeatures: Record<string, any> = {};
    if (company.subscriptionPlan) {
      const planDoc = await Plan.findOne({ planCode: company.subscriptionPlan }).lean();
      if (planDoc && planDoc.features) {
        planFeatures = planDoc.features;
      }
    }

    // 1. Initialize Tenant Settings Documents
    await CompanySettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        companyName: data.companyInfo?.companyName || company.companyName,
        legalName: data.companyInfo?.legalName || company.legalName || "",
        companyCode: data.companyInfo?.companyCode || company.companyCode,
        companyEmail: data.companyInfo?.email || company.email,
        supportEmail: data.companyInfo?.supportEmail || "",
        phone: data.companyInfo?.phone || company.phone,
        alternatePhone: data.companyInfo?.alternatePhone || "",
        website: data.companyInfo?.website || company.website || "",
        timezone: data.companyInfo?.timezone || "Asia/Kolkata",
        currency: data.companyInfo?.currency || "INR",
        language: data.companyInfo?.language || "en",
        country: data.address?.country || "India",
        state: data.address?.state || "Delhi",
        district: data.address?.district || "",
        city: data.address?.city || "New Delhi",
        pincode: data.address?.pincode || "110001",
        address: data.address?.street || company.address || "",
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    const allowBranding = planFeatures?.customBranding === true;
    await BrandingSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        primaryColor: allowBranding ? data.branding?.primaryColor || "#3b82f6" : "#3b82f6",
        secondaryColor: allowBranding ? data.branding?.secondaryColor || "#1e40af" : "#1e40af",
        theme: allowBranding ? data.branding?.theme || "system" : "system",
        companyLogo: allowBranding ? data.branding?.companyLogo || "" : "",
        loginLogo: allowBranding ? data.branding?.loginLogo || "" : "",
        favicon: allowBranding ? data.branding?.favicon || "" : "",
        isEnabled: allowBranding && (data.branding?.isEnabled !== false),
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    const allowSMTP = planFeatures?.customSmtp === true || planFeatures?.emailNotifications === true;
    await SMTPSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        host: allowSMTP ? data.smtp?.host || "" : "",
        port: allowSMTP ? data.smtp?.port || 587 : 587,
        username: allowSMTP ? data.smtp?.username || "" : "",
        password: allowSMTP ? data.smtp?.password || "" : "",
        encryption: allowSMTP ? data.smtp?.encryption || "TLS" : "TLS",
        senderName: allowSMTP ? data.smtp?.senderName || company.companyName : company.companyName,
        senderEmail: allowSMTP ? data.smtp?.senderEmail || company.email : company.email,
        isVerified: allowSMTP && (data.smtp?.isVerified === true),
        isEnabled: allowSMTP && (data.smtp?.isEnabled === true),
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    await SecuritySettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        sessionTimeout: data.systemPreferences?.sessionTimeout || 30,
        passwordPolicy: data.systemPreferences?.passwordPolicy || {
          minLength: 8,
          requireNumbers: true,
          requireSpecialChars: true,
          requireUppercase: true,
        },
        ipWhitelist: [],
        twoFactorAuthRequired: false,
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    await NotificationSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: planFeatures?.smsNotifications === true,
        pushNotificationsEnabled: true,
        emailTemplates: [
          { name: "Welcome Email", subject: "Welcome to our Exam Platform", body: "Hello {name}, welcome onboard!" },
          { name: "Admit Card Released", subject: "Your Admit Card is Ready", body: "Please download your admit card from dashboard." },
        ],
        notificationTemplates: [
          { name: "Exam Reminder", text: "Your exam starts in 1 hour." },
        ],
        certificateTemplates: [
          { name: "Default Merit Certificate", orientation: "landscape", title: "Certificate of Achievement" },
        ],
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    await AuditSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        logAllQueries: false,
        logLogins: true,
        logDataModifications: true,
        logSecurityEvents: true,
        retentionDays: 90,
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    const storageCapMB = company.subscriptionPlan === "ENTERPRISE" ? 51200 : company.subscriptionPlan === "PROFESSIONAL" ? 10240 : 5120;
    await StorageSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        allocatedStorageMB: storageCapMB,
        usedStorageMB: 0,
        rootFolderStructure: [
          "/Exams",
          "/Candidates",
          "/Certificates",
          "/QuestionBanks",
          "/Reports",
          "/AdmitCards",
          "/Biometrics",
        ],
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    await TenantSystemSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        academicYear: data.systemPreferences?.academicYear || "2026-2027",
        financialYear: data.systemPreferences?.financialYear || "2026-2027",
        dateFormat: data.systemPreferences?.dateFormat || "YYYY-MM-DD",
        timeFormat: data.systemPreferences?.timeFormat || "24H",
        weekStart: data.systemPreferences?.weekStart || "Monday",
        sessionTimeout: data.systemPreferences?.sessionTimeout || 30,
        createdBy: usrId,
        updatedBy: usrId,
      },
      { upsert: true, returnDocument: "after" }
    );

    // 2. Default Branch & Center auto-initialization removed so companies start with clean dynamic data

    // 3. Role Hierarchy Generation (15 Tiers)
    const roleHierarchyDef = [
      { code: "COMPANY_ADMIN", name: "COMPANY_ADMIN", displayName: "Company Admin", level: 0, desc: "Root tenant administrator with full permissions" },

      { code: "CENTER_MANAGER", name: "CENTER_MANAGER", displayName: "Center Manager", level: 2, desc: "Oversees center readiness, seating, and exam shifts" },
      { code: "EXAM_MANAGER", name: "EXAM_MANAGER", displayName: "Exam Manager", level: 3, desc: "Schedules examinations, shifts, and monitors execution" },
      { code: "PAPER_SETTER", name: "PAPER_SETTER", displayName: "Paper Setter", level: 4, desc: "Creates and approves examination paper sections" },
      { code: "QUESTION_SETTER", name: "QUESTION_SETTER", displayName: "Question Setter", level: 5, desc: "Authors questions and maintains the question bank" },
      { code: "BIOMETRIC_VERIFIER", name: "BIOMETRIC_VERIFIER", displayName: "Biometric Verifier", level: 6, desc: "Performs facial and biometric attendance verification" },
      { code: "ENTRY_CHECKER", name: "ENTRY_CHECKER", displayName: "Entry Checker", level: 7, desc: "Verifies candidate admit cards at exam gates" },
      { code: "OBSERVER", name: "OBSERVER", displayName: "Observer", level: 8, desc: "External compliance and audit monitor during live exams" },
      { code: "TECHNICAL_MANAGER", name: "TECHNICAL_MANAGER", displayName: "Technical Manager", level: 9, desc: "Manages network, systems, and client software operations" },
      { code: "INVIGILATOR", name: "INVIGILATOR", displayName: "Invigilator", level: 10, desc: "Proctors assigned exam room and supervises candidates" },
      { code: "AI_PROCTOR", name: "AI_PROCTOR", displayName: "AI Proctor", level: 11, desc: "AI Automated proctoring system supervisor" },
      { code: "COMMAND_CENTER", name: "COMMAND_CENTER", displayName: "Command Center", level: 12, desc: "Centralized live surveillance and incident handler" },
      { code: "AUDIT_OFFICER", name: "AUDIT_OFFICER", displayName: "Audit Officer", level: 13, desc: "Reviews post-exam audit logs and compliance metrics" },
      { code: "CANDIDATE", name: "CANDIDATE", displayName: "Candidate", level: 14, desc: "Registered test taker for scheduled examinations" },
    ];

    // Fetch available permissions from database to attach to roles
    const allPerms = await Permission.find({ $or: [{ companyId: null }, { companyId: compId }] }).lean();
    
    let lastParentId = null;
    for (const rDef of roleHierarchyDef) {
      // Respect plan features: if AI proctoring is disabled in plan, limit AI_PROCTOR role
      let roleStatus: RoleStatus = RoleStatus.ACTIVE;
      if (rDef.code === "AI_PROCTOR" && planFeatures?.aiProctoring === false) {
        roleStatus = RoleStatus.INACTIVE;
      }

      // Assign relevant permissions based on hierarchy level
      let rolePerms = allPerms.map(p => p._id);
      if (rDef.level > 0 && rDef.level <= 3) {
        // managers don't manage company subscriptions
        rolePerms = allPerms.filter(p => p.module !== "SUBSCRIPTION" && p.module !== "COMPANY_SETTINGS").map(p => p._id);
      } else if (rDef.level >= 4 && rDef.level <= 5) {
        rolePerms = allPerms.filter(p => ["QUESTION_BANK", "PAPER", "SUBJECT", "TOPIC", "CHAPTER"].includes(p.module)).map(p => p._id);
      } else if (rDef.level >= 6 && rDef.level <= 8) {
        rolePerms = allPerms.filter(p => ["ATTENDANCE", "BIOMETRIC_VERIFICATION", "FACE_VERIFICATION", "ADMIT_CARD"].includes(p.module)).map(p => p._id);
      } else if (rDef.level >= 10 && rDef.level <= 12) {
        rolePerms = allPerms.filter(p => ["LIVE_MONITORING", "EXAM_SUBMISSION", "ATTENDANCE"].includes(p.module)).map(p => p._id);
      } else if (rDef.level === 13) {
        rolePerms = allPerms.filter(p => ["AUDIT_LOG", "REPORT", "ANALYTICS", "TRUST_SCORE"].includes(p.module)).map(p => p._id);
      } else if (rDef.level === 14) {
        rolePerms = allPerms.filter(p => ["CANDIDATE_EXAM", "CANDIDATE_ANSWER"].includes(p.module)).map(p => p._id);
      }

      const existingRole = await Role.findOne({ companyId: compId, roleCode: rDef.code });
      let savedRole;
      if (existingRole) {
        existingRole.parentRole = lastParentId;
        existingRole.hierarchyLevel = rDef.level;
        existingRole.permissions = rolePerms as any;
        existingRole.status = roleStatus;
        savedRole = await existingRole.save();
      } else {
        savedRole = await Role.create({
          companyId: compId,
          name: rDef.name,
          displayName: rDef.displayName,
          roleCode: rDef.code,
          parentRole: lastParentId,
          hierarchyLevel: rDef.level,
          description: rDef.desc,
          permissions: rolePerms,
          isSystem: false,
          status: roleStatus,
          createdBy: usrId,
          updatedBy: usrId,
        });
      }
      lastParentId = savedRole._id;

      // Seed explicit RolePermission database records for instantaneous RBAC lookup
      for (const pId of rolePerms) {
        await RolePermission.findOneAndUpdate(
          { roleId: savedRole._id, permissionId: pId, companyId: compId },
          { status: RolePermissionStatus.ACTIVE, isDeleted: false },
          { upsert: true, new: true }
        );
      }
    }

    // 4. Mark Onboarding as Completed on Company
    company.onboardingCompleted = true;
    await company.save();

    // 5. Log Audit Event
    await auditLogService.log({
      action: AuditAction.GENERATE,
      module: "Company Onboarding",
      companyId: compId,
      performedBy: usrId,
      description: `Completed multi-step onboarding and automated tenant initialization (Branches, Centers, Roles, Settings)`,
      ipAddress: reqMeta?.ip || "127.0.0.1",
      userAgent: reqMeta?.userAgent || "Browser",
      deviceType: "Desktop",
      severity: AuditSeverity.MEDIUM,
    });

    return {
      success: true,
      message: "Onboarding completed successfully with automated tenant initialization.",
      data: {
        onboardingCompleted: true,
        rolesCount: roleHierarchyDef.length,
      },
    };
  }

  /**
   * Dynamically generate sidebar navigation based on Role, Permissions, and Plan Features directly from MongoDB
   */
  async getDynamicNavigation(user: any) {
    if (!user || !user.companyId) {
      return { menu: [] };
    }

    const company = await Company.findById(user.companyId).select("subscriptionPlan onboardingCompleted").lean();
    const dynamicMenu = await sidebarService.getUserNavigation(user);

    return {
      menu: Array.isArray(dynamicMenu) ? dynamicMenu : dynamicMenu.tree || dynamicMenu.menu || [],
      onboardingCompleted: !!company?.onboardingCompleted,
      planCode: company?.subscriptionPlan || "STARTER",
    };
  }
}
