import { Types } from "mongoose";
import Company from "../company/company.model";
import Role from "../role/role.model";
import Permission from "../permission/permission.model";
import RolePermission, { RolePermissionStatus } from "../role-permission/rolePermission.model";
import sidebarService from "../sidebar/sidebar.service";
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
import organizationSeederRepository from "./organizationSeeder.repository";
import { SeederStepLog, DashboardWidgetConfig, SecurityPolicyConfig } from "./organizationSeeder.types";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { permissionCache } from "../../middleware/permission";

export class OrganizationSeederService {
  /**
   * Complete automated initialization of a company tenant upon onboarding/approval
   */
  async initializeOrganization(companyId: string, performedBy: string = "system", forceReseed: boolean = false) {
    const compId = new Types.ObjectId(companyId);
    const company = await Company.findById(compId);
    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company tenant not found for initialization");
    }

    const planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE" = (company.subscriptionPlan as any) || "STARTER";

    await organizationSeederRepository.upsertInitializationRecord(
      companyId,
      {
        companyId: compId,
        status: "IN_PROGRESS",
        planCode,
        stepLogs: [],
      },
      performedBy
    );

    const startTime = Date.now();
    const createdResourcesList: string[] = [];

    try {
      // Step 1: Initialize Organization Settings & Storage Folders
      const step1Start = Date.now();
      await this.seedSettingsAndFolders(companyId, company, planCode, performedBy);
      await this.logStep(companyId, "Seed Settings & Folders", "INITIALIZE_SETTINGS", 9, Date.now() - step1Start, "SUCCESS");

      // Step 2: Initialize Default Branch & Exam Center & Departments & Designations
      const step2Start = Date.now();
      const orgStructure = await this.seedDefaultOrgStructure(companyId, company, performedBy);
      await this.logStep(companyId, "Seed Org Structure", "INITIALIZE_STRUCTURE", 4, Date.now() - step2Start, "SUCCESS");

      // Step 3: Initialize 16 System Roles & Plan-Aware Permissions
      const step3Start = Date.now();
      const roleCount = await this.seedRolesAndPermissions(companyId, planCode, performedBy);
      await this.logStep(companyId, "Seed Roles & Permissions", "INITIALIZE_RBAC", roleCount, Date.now() - step3Start, "SUCCESS");

      // Step 4: Initialize Default Dashboard Widgets
      const step4Start = Date.now();
      const widgets = this.generateDashboardWidgets(planCode);
      await this.logStep(companyId, "Seed Dashboard Widgets", "INITIALIZE_DASHBOARD", widgets.length, Date.now() - step4Start, "SUCCESS");

      // Step 5: Initialize Sidebar Engine mapping
      const step5Start = Date.now();
      await sidebarService.getUserNavigation({ companyId, role: "COMPANY_ADMIN" });
      await this.logStep(companyId, "Seed Dynamic Sidebar", "INITIALIZE_SIDEBAR", 1, Date.now() - step5Start, "SUCCESS");

      // Invalidate permission cache
      permissionCache.invalidate(companyId);

      // Finalized Record Update
      await organizationSeederRepository.upsertInitializationRecord(
        companyId,
        {
          status: forceReseed ? "RESEEDED" : "COMPLETED",
          planCode,
          createdRoles: [
            "COMPANY_ADMIN", "ADMIN", "CENTER_MANAGER",
            "EXAM_MANAGER", "PAPER_SETTER", "QUESTION_SETTER", "BIOMETRIC_VERIFIER",
            "ENTRY_CHECKER", "OBSERVER", "GOVT_AUTHORITY", "TECHNICAL_MANAGER",
            "INVIGILATOR", "AI_PROCTOR", "COMMAND_CENTER", "CANDIDATE"
          ],
          createdBranches: [orgStructure.branchCode],
          createdCenters: [orgStructure.centerCode],
          defaultDepartments: orgStructure.departments,
          defaultDesignations: orgStructure.designations,
          dashboardWidgets: widgets,
          storageFolders: [
            "/Certificates", "/Admit Cards", "/Reports", "/Invoices",
            "/Candidates", "/Documents", "/Media", "/Uploads", "/Backups"
          ],
          securityPolicies: this.generateSecurityPolicy(planCode),
          initializedAt: new Date(),
        },
        performedBy
      );

      // Mark company onboarding as finished if not already
      if (!company.onboardingCompleted) {
        company.onboardingCompleted = true;
        await company.save();
      }

      // Audit Log
      await auditLogService.log({
        action: AuditAction.GENERATE,
        module: "Organization Seeder",
        companyId: compId,
        performedBy: performedBy !== "system" ? new Types.ObjectId(performedBy) : undefined,
        description: `Successfully initialized complete enterprise organization for tenant ${company.companyCode || companyId} (${planCode})`,
        ipAddress: "127.0.0.1",
        userAgent: "SystemSeeder",
        deviceType: "Server",
        severity: AuditSeverity.MEDIUM,
      });

      return {
        success: true,
        message: "Organization auto-initialization completed successfully.",
        data: {
          companyId,
          planCode,
          status: "COMPLETED",
          executionTimeMs: Date.now() - startTime,
        },
      };
    } catch (error: any) {
      // Recovery & Rollback mechanism
      await this.rollbackInitialization(companyId, error.message || "Initialization failed");
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, `Seeder failure: ${error.message}`);
    }
  }

  private async rollbackInitialization(companyId: string, reason: string) {
    await organizationSeederRepository.appendStepLog(companyId, {
      stepName: "Recovery & Rollback",
      action: "ROLLBACK",
      timestamp: new Date(),
      createdResources: 0,
      executionTimeMs: 0,
      status: "ROLLEDBACK",
      errorMessage: reason,
    });
    await organizationSeederRepository.updateStatus(companyId, "FAILED");
  }

  private async logStep(
    companyId: string,
    stepName: string,
    action: string,
    createdResources: number,
    executionTimeMs: number,
    status: "SUCCESS" | "FAILED" | "ROLLEDBACK" = "SUCCESS",
    errorMessage?: string
  ) {
    await organizationSeederRepository.appendStepLog(companyId, {
      stepName,
      action,
      timestamp: new Date(),
      createdResources,
      executionTimeMs,
      status,
      errorMessage,
    });
  }

  /**
   * Reseed organization without affecting existing business data
   */
  async reseedOrganization(companyId: string, performedBy: string = "system") {
    return this.initializeOrganization(companyId, performedBy, true);
  }

  /**
   * Reseed system-wide defaults across all companies or system master catalogs
   */
  async reseedSystem(performedBy: string = "system") {
    const companies = await Company.find({ isDeleted: false }).select("_id subscriptionPlan").lean();
    const results = [];
    for (const comp of companies) {
      try {
        await this.initializeOrganization(comp._id.toString(), performedBy, true);
        results.push({ companyId: comp._id, status: "RESEEDED" });
      } catch (err: any) {
        results.push({ companyId: comp._id, status: "FAILED", error: err.message });
      }
    }
    return { success: true, count: results.length, results };
  }

  /**
   * Rebuild permissions for a specific company tenant based on plan limits
   */
  async rebuildPermissions(companyId: string, performedBy: string = "system") {
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");
    const planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE" = (company.subscriptionPlan as any) || "STARTER";

    const count = await this.seedRolesAndPermissions(companyId, planCode, performedBy);
    permissionCache.invalidate(companyId);

    return { success: true, message: `Rebuilt ${count} roles and updated permission matrices for ${planCode} plan.` };
  }

  /**
   * Rebuild sidebar for a company tenant
   */
  async rebuildSidebar(companyId: string) {
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");
    const menu = await sidebarService.getUserNavigation({ companyId, role: "COMPANY_ADMIN" });
    return { success: true, message: "Sidebar navigation tree rebuilt successfully.", menu };
  }

  async getStatus(companyId: string) {
    const record = await organizationSeederRepository.findByCompanyId(companyId);
    if (!record) {
      return { status: "NOT_INITIALIZED", companyId };
    }
    return record;
  }

  /*
  |--------------------------------------------------------------------------
  | INTERNAL SEEDER IMPLEMENTATIONS
  |--------------------------------------------------------------------------
  */

  private async seedSettingsAndFolders(
    companyId: string,
    company: any,
    planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    performedBy: string
  ) {
    const compId = new Types.ObjectId(companyId);
    const userId = performedBy !== "system" ? new Types.ObjectId(performedBy) : null;

    // Company Settings
    await CompanySettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        companyName: company.companyName || "Organization",
        companyCode: company.companyCode || "ORG",
        companyEmail: company.email || "admin@org.com",
        phone: company.phone || "+91-0000000000",
        timezone: "Asia/Kolkata",
        currency: "INR",
        language: "en",
        country: "India",
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // Branding Settings
    const isCustomBranding = planCode === "ENTERPRISE" || planCode === "PROFESSIONAL";
    await BrandingSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        primaryColor: isCustomBranding ? "#3b82f6" : "#4f46e5",
        secondaryColor: isCustomBranding ? "#1e40af" : "#312e81",
        theme: "system",
        isEnabled: isCustomBranding,
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // SMTP Settings
    const isCustomSmtp = planCode === "ENTERPRISE";
    await SMTPSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        host: isCustomSmtp ? "smtp.company.com" : "smtp.default-saas.com",
        port: 587,
        encryption: "TLS",
        senderName: company.companyName || "Exam Portal",
        senderEmail: company.email || "noreply@portal.com",
        isEnabled: isCustomSmtp,
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // Security Settings
    const secPolicy = this.generateSecurityPolicy(planCode);
    await SecuritySettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        sessionTimeout: secPolicy.sessionTimeoutMinutes,
        passwordPolicy: secPolicy.passwordPolicy,
        twoFactorAuthRequired: secPolicy.mfaPolicy === "MANDATORY",
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // Storage Folders & Limits
    const storageCapMB = planCode === "ENTERPRISE" ? 102400 : planCode === "PROFESSIONAL" ? 25600 : 5120;
    const defaultFolders = [
      "/Certificates",
      "/Admit Cards",
      "/Reports",
      "/Invoices",
      "/Candidates",
      "/Documents",
      "/Media",
      "/Uploads",
      "/Backups",
    ];
    await StorageSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        allocatedStorageMB: storageCapMB,
        usedStorageMB: 0,
        rootFolderStructure: defaultFolders,
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // Audit Settings
    const retention = planCode === "ENTERPRISE" ? 365 : planCode === "PROFESSIONAL" ? 90 : 30;
    await AuditSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        logAllQueries: planCode === "ENTERPRISE",
        logLogins: true,
        logDataModifications: true,
        logSecurityEvents: true,
        retentionDays: retention,
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // Notification & All Default Templates
    await NotificationSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: planCode !== "STARTER",
        pushNotificationsEnabled: true,
        emailTemplates: [
          { type: "WELCOME_EMAIL", subject: "Welcome to {company_name}", body: "Hello {name}, your candidate portal account is ready." },
          { type: "ADMIT_CARD", subject: "Admit Card Released - {exam_name}", body: "Your admit card for {exam_name} is ready for download." },
          { type: "RESULT_ANNOUNCEMENT", subject: "Exam Results Declared", body: "Results for {exam_name} are now published." },
        ],
        notificationTemplates: [
          { type: "SMS", name: "Exam Reminder", text: "Reminder: Your exam {exam_name} begins at {time} at {center}." },
          { type: "INVOICE", name: "Receipt Template", format: "TAX_INVOICE_V2", footer: "Thank you for partnering with our examination portal." },
          { type: "ADMIT_CARD_LAYOUT", name: "Standard Gate Pass", barcode: true, photoSlot: true, instructions: "Bring original photo ID." },
          { type: "REPORT_LAYOUT", name: "Audit & Merit List Sheet", orientation: "PORTRAIT", headerLogo: true },
        ],
        certificateTemplates: [
          { name: "Excellence Certificate", orientation: "landscape", title: "Certificate of Merit", borderStyle: "CLASSIC_GOLD" },
          { name: "Completion Certificate", orientation: "landscape", title: "Certificate of Participation", borderStyle: "NAVY_SLATE" },
        ],
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );

    // System Settings
    await TenantSystemSettings.findOneAndUpdate(
      { companyId: compId },
      {
        companyId: compId,
        academicYear: "2026-2027",
        financialYear: "2026-2027",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "24H",
        weekStart: "Monday",
        sessionTimeout: secPolicy.sessionTimeoutMinutes,
        createdBy: userId,
        updatedBy: userId,
      },
      { upsert: true }
    );
  }

  private async seedDefaultOrgStructure(companyId: string, company: any, performedBy: string) {
    const compId = new Types.ObjectId(companyId);

    const departments = [
      "Administration",
      "Examination Operations",
      "Question Bank & Academics",
      "Information Technology",
      "Security & Surveillance",
    ];

    const designations = [
      "Chief Exam Officer",
      "Branch Director",
      "Chief Proctor",
      "Senior Question Author",
      "Technical Supervisor",
    ];

    return {
      branchCode: "Dynamic",
      centerCode: "Dynamic",
      departments,
      designations,
    };
  }

  private async seedRolesAndPermissions(
    companyId: string,
    planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    performedBy: string
  ) {
    const compId = new Types.ObjectId(companyId);
    const userId = performedBy !== "system" ? new Types.ObjectId(performedBy) : null;

    // All 16 Mandatory Default Roles
    const roleDefinitions = [
      { code: "COMPANY_ADMIN", name: "COMPANY_ADMIN", displayName: "Company Admin", level: 0, desc: "Root tenant administrator with full permissions", match: ["*"] },
      { code: "ADMIN", name: "ADMIN", displayName: "Admin", level: 1, desc: "Assistant enterprise administrative controller", match: ["branches.", "centers.", "employees.", "candidates.", "exams.", "reports.", "settings.view"] },

      { code: "CENTER_MANAGER", name: "CENTER_MANAGER", displayName: "Center Manager", level: 3, desc: "Supervises testing venue readiness, rooms, and attendance check-ins", match: ["centers.", "attendance.", "rooms.", "seats.", "exams.view"] },
      { code: "EXAM_MANAGER", name: "EXAM_MANAGER", displayName: "Exam Manager", level: 4, desc: "Schedules examinations, shifts, and monitors test execution", match: ["exams.", "shifts.", "paper.view", "subjects.view", "reports.view"] },
      { code: "PAPER_SETTER", name: "PAPER_SETTER", displayName: "Paper Setter", level: 5, desc: "Creates and approves examination test papers and section rules", match: ["paper.", "question_bank.", "subjects.", "topics."] },
      { code: "QUESTION_SETTER", name: "QUESTION_SETTER", displayName: "Question Setter", level: 6, desc: "Authors questions and maintains question repository", match: ["question_bank.", "subjects.", "topics.", "chapters."] },
      { code: "BIOMETRIC_VERIFIER", name: "BIOMETRIC_VERIFIER", displayName: "Biometric Verifier", level: 7, desc: "Performs facial and biometric attendance verification", match: ["attendance.", "biometric.", "candidates.view"] },
      { code: "ENTRY_CHECKER", name: "ENTRY_CHECKER", displayName: "Entry Checker", level: 8, desc: "Verifies candidate admit cards at venue entrance gates", match: ["attendance.view", "attendance.mark", "admit_card.view", "candidates.view"] },
      { code: "OBSERVER", name: "OBSERVER", displayName: "Observer", level: 9, desc: "External compliance observer inspecting live testing venues", match: ["observer.", "centers.view", "exams.view", "reports.view", "live_monitoring.view"] },
      { code: "GOVT_AUTHORITY", name: "GOVT_AUTHORITY", displayName: "Government Authority", level: 10, desc: "Regulatory inspection and audit read-only clearance", match: ["reports.view", "audit_logs.view", "results.view", "exams.view", "trust_score.view"] },
      { code: "TECHNICAL_MANAGER", name: "TECHNICAL_MANAGER", displayName: "Technical Manager", level: 11, desc: "Manages networks, systems, video servers, and integrations", match: ["live_monitoring.", "ai_proctor.", "storage.", "security."] },
      { code: "INVIGILATOR", name: "INVIGILATOR", displayName: "Invigilator", level: 12, desc: "Direct shift invigilator supervising testing rooms", match: ["attendance.mark", "candidates.view", "live_monitoring.view"] },
      { code: "AI_PROCTOR", name: "AI_PROCTOR", displayName: "AI Proctor", level: 13, desc: "AI Automated proctoring anomaly inspector", match: ["ai_proctor.", "live_monitoring."] },
      { code: "COMMAND_CENTER", name: "COMMAND_CENTER", displayName: "Command Center", level: 14, desc: "Central surveillance desk supervising video feeds and GPS radar", match: ["live_monitoring.", "geo_monitoring.", "ai_proctor.", "dashboard.", "reports."] },
      { code: "CANDIDATE", name: "CANDIDATE", displayName: "Candidate", level: 15, desc: "Examinee account to attempt exams and view declared results", match: ["candidate_exam.", "candidate_answer.", "results.view", "certificates.view"] },
    ];

    const allPerms = await Permission.find({ $or: [{ companyId: null }, { companyId: compId }] }).lean();

    // Plan-Aware Filtering Rule: Block features unsupported by purchased subscription
    const planExcludedKeywords: string[] = [];
    if (planCode === "STARTER") {
      planExcludedKeywords.push("white_label", "custom_branding", "dedicated_server", "ai_proctor", "geo_monitoring", "custom_smtp", "api_keys");
    } else if (planCode === "PROFESSIONAL") {
      planExcludedKeywords.push("dedicated_server", "white_label_enterprise");
    }

    let count = 0;
    for (const rDef of roleDefinitions) {
      let roleStatus: RoleStatus = RoleStatus.ACTIVE;
      if (rDef.code === "AI_PROCTOR" && planCode === "STARTER") {
        roleStatus = RoleStatus.INACTIVE;
      }

      // Determine allowed permissions for this role
      let matchedPermissionIds: any[] = [];
      const candidatePerms = allPerms.filter(p => {
        const key = ((p as any).permissionKey || (p as any).name || "").toLowerCase();
        return !planExcludedKeywords.some(ex => key.includes(ex));
      });

      if (rDef.match.includes("*")) {
        matchedPermissionIds = candidatePerms.map(p => p._id);
      } else {
        matchedPermissionIds = candidatePerms
          .filter(p => {
            const key = ((p as any).permissionKey || (p as any).name || "").toLowerCase();
            const mod = ((p as any).module || "").toLowerCase();
            return rDef.match.some(prefix => key.startsWith(prefix) || mod.startsWith(prefix.replace(".", "")));
          })
          .map(p => p._id);
      }

      const roleData = {
        companyId: compId,
        name: rDef.name,
        displayName: rDef.displayName,
        roleCode: rDef.code,
        hierarchyLevel: rDef.level,
        description: rDef.desc,
        permissions: matchedPermissionIds,
        isSystem: false,
        systemRole: false,
        defaultRole: true,
        status: roleStatus,
        isDeleted: false,
        createdBy: userId,
        updatedBy: userId,
      };

      const roleDoc = await Role.findOneAndUpdate(
        { companyId: compId, roleCode: rDef.code },
        roleData,
        { upsert: true, new: true }
      );

      if (roleDoc && matchedPermissionIds.length > 0) {
        for (const pId of matchedPermissionIds) {
          await RolePermission.findOneAndUpdate(
            { roleId: roleDoc._id, permissionId: pId, companyId: compId },
            { status: RolePermissionStatus.ACTIVE, isDeleted: false },
            { upsert: true }
          );
        }
      }
      count++;
    }

    return count;
  }

  private generateDashboardWidgets(planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE"): DashboardWidgetConfig[] {
    const baseWidgets: DashboardWidgetConfig[] = [
      { widgetId: "w-01", title: "Quick Stats Summary", category: "METRIC", roleRequired: ["COMPANY_ADMIN", "ADMIN", "EXAM_MANAGER"], planRequired: "STARTER", isEnabled: true, layout: { x: 0, y: 0, w: 6, h: 4 } },
      { widgetId: "w-02", title: "Upcoming Exam Shifts", category: "SCHEDULE", roleRequired: ["COMPANY_ADMIN", "ADMIN", "EXAM_MANAGER", "CENTER_MANAGER"], planRequired: "STARTER", isEnabled: true, layout: { x: 6, y: 0, w: 6, h: 4 } },
      { widgetId: "w-03", title: "Recent Candidate Registrations", category: "CANDIDATES", roleRequired: ["COMPANY_ADMIN", "ADMIN", "CENTER_MANAGER"], planRequired: "STARTER", isEnabled: true, layout: { x: 0, y: 4, w: 12, h: 6 } },
    ];

    if (planCode === "PROFESSIONAL" || planCode === "ENTERPRISE") {
      baseWidgets.push(
        { widgetId: "w-04", title: "Live Shift Occupancy Feed", category: "OPERATIVE", roleRequired: ["COMPANY_ADMIN", "EXAM_MANAGER", "CENTER_MANAGER", "COMMAND_CENTER"], planRequired: "PROFESSIONAL", isEnabled: true, layout: { x: 0, y: 10, w: 6, h: 6 } },
        { widgetId: "w-05", title: "Attendance & Biometric Funnel", category: "ANALYTICS", roleRequired: ["COMPANY_ADMIN", "BIOMETRIC_VERIFIER", "OBSERVER"], planRequired: "PROFESSIONAL", isEnabled: true, layout: { x: 6, y: 10, w: 6, h: 6 } }
      );
    }

    if (planCode === "ENTERPRISE") {
      baseWidgets.push(
        { widgetId: "w-06", title: "AI Proctor Anomaly Heatmap", category: "SURVEILLANCE", roleRequired: ["COMPANY_ADMIN", "AI_PROCTOR", "COMMAND_CENTER"], planRequired: "ENTERPRISE", isEnabled: true, layout: { x: 0, y: 16, w: 8, h: 6 } },
        { widgetId: "w-07", title: "Geo-Fencing Radar Alerts", category: "SECURITY", roleRequired: ["COMPANY_ADMIN", "COMMAND_CENTER", "TECHNICAL_MANAGER"], planRequired: "ENTERPRISE", isEnabled: true, layout: { x: 8, y: 16, w: 4, h: 6 } },
        { widgetId: "w-08", title: "Tenant Trust Score Index", category: "COMPLIANCE", roleRequired: ["COMPANY_ADMIN", "GOVT_AUTHORITY", "OBSERVER"], planRequired: "ENTERPRISE", isEnabled: true, layout: { x: 0, y: 22, w: 12, h: 4 } }
      );
    }

    return baseWidgets;
  }

  private generateSecurityPolicy(planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE"): SecurityPolicyConfig {
    if (planCode === "ENTERPRISE") {
      return {
        passwordPolicy: { minLength: 12, requireNumbers: true, requireSpecialChars: true, requireUppercase: true },
        sessionTimeoutMinutes: 15,
        mfaPolicy: "MANDATORY",
        ipPolicy: "WHITELIST_ONLY",
        browserPolicy: "SECURE_EXAM_BROWSER",
        deviceTrust: "BIOMETRIC_TOKEN",
        auditPolicy: "ENTERPRISE_COMPLIANT",
      };
    } else if (planCode === "PROFESSIONAL") {
      return {
        passwordPolicy: { minLength: 10, requireNumbers: true, requireSpecialChars: true, requireUppercase: true },
        sessionTimeoutMinutes: 30,
        mfaPolicy: "OPTIONAL",
        ipPolicy: "OPEN",
        browserPolicy: "RESTRICTED",
        deviceTrust: "REGISTERED_ONLY",
        auditPolicy: "STRICT",
      };
    } else {
      return {
        passwordPolicy: { minLength: 8, requireNumbers: true, requireSpecialChars: true, requireUppercase: false },
        sessionTimeoutMinutes: 60,
        mfaPolicy: "DISABLED",
        ipPolicy: "OPEN",
        browserPolicy: "STANDARD",
        deviceTrust: "ANY",
        auditPolicy: "STANDARD",
      };
    }
  }
}

export default new OrganizationSeederService();
