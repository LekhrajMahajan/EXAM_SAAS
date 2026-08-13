import Permission from "./permission.model";
import SidebarItem from "../sidebar/sidebar.model";
import { PermissionStatus } from "./permission.types";
import Role from "../role/role.model";
import { RoleStatus, RoleType, RoleCategory } from "../role/role.types";

export interface PermissionSeedDef {
  name: string;
  displayName: string;
  module: string;
  group?: string;
  action: string;
  resource?: string;
  category?: string;
  description: string;
  apiEndpoint?: string;
  httpMethod?: string;
  frontendRoute?: string;
  icon?: string;
  sortOrder?: number;
}

export const defaultPermissions: PermissionSeedDef[] = [
  // 1. Dashboard
  { name: "dashboard.view", displayName: "View Dashboard", module: "DASHBOARD", group: "Dashboard", action: "VIEW", resource: "dashboard", category: "CORE", description: "Can view system overview and operational metrics", icon: "LayoutDashboard", sortOrder: 1 },
  { name: "dashboard.manage", displayName: "Manage Dashboard Widgets", module: "DASHBOARD", group: "Dashboard", action: "MANAGE", resource: "dashboard", category: "FEATURE", description: "Can customize and configure dashboard reporting widgets", icon: "LayoutDashboard", sortOrder: 2 },

  // 2. Company
  { name: "company.view", displayName: "View Company Profile", module: "COMPANY", group: "Company", action: "VIEW", resource: "company", category: "CORE", description: "Can view corporate organizational details and licensing", icon: "Building", sortOrder: 10 },
  { name: "company.update", displayName: "Update Company Profile", module: "COMPANY", group: "Company", action: "UPDATE", resource: "company", category: "CORE", description: "Can modify corporate identity and tax information", icon: "Building", sortOrder: 11 },

  // 3. Branch
  { name: "branches.view", displayName: "View Branches", module: "BRANCH", group: "Branch", action: "VIEW", resource: "branches", category: "CORE", description: "Can view branch details and statistics", icon: "Building2", sortOrder: 20 },
  { name: "branches.create", displayName: "Create Branches", module: "BRANCH", group: "Branch", action: "CREATE", resource: "branches", category: "CORE", description: "Can create new operational branches", icon: "Building2", sortOrder: 21 },
  { name: "branches.update", displayName: "Update Branches", module: "BRANCH", group: "Branch", action: "UPDATE", resource: "branches", category: "CORE", description: "Can modify branch records", icon: "Building2", sortOrder: 22 },
  { name: "branches.delete", displayName: "Delete Branches", module: "BRANCH", group: "Branch", action: "DELETE", resource: "branches", category: "CORE", description: "Can delete branch records", icon: "Building2", sortOrder: 23 },
  { name: "branches.export", displayName: "Export Branches", module: "BRANCH", group: "Branch", action: "EXPORT", resource: "branches", category: "REPORTING", description: "Can export branch data to spreadsheets", icon: "Download", sortOrder: 24 },
  { name: "branches.import", displayName: "Import Branches", module: "BRANCH", group: "Branch", action: "IMPORT", resource: "branches", category: "FEATURE", description: "Can import branch records in bulk", icon: "Upload", sortOrder: 25 },

  // 4. Center
  { name: "centers.view", displayName: "View Exam Centers", module: "CENTER", group: "Center", action: "VIEW", resource: "centers", category: "CORE", description: "Can view exam centers and room allocations", icon: "MapPin", sortOrder: 30 },
  { name: "centers.create", displayName: "Create Exam Centers", module: "CENTER", group: "Center", action: "CREATE", resource: "centers", category: "CORE", description: "Can register new examination testing facilities", icon: "MapPin", sortOrder: 31 },
  { name: "centers.update", displayName: "Update Exam Centers", module: "CENTER", group: "Center", action: "UPDATE", resource: "centers", category: "CORE", description: "Can update exam center capacity and amenities", icon: "MapPin", sortOrder: 32 },
  { name: "centers.manage", displayName: "Manage Exam Centers", module: "CENTER", group: "Center", action: "MANAGE", resource: "centers", category: "FEATURE", description: "Can configure exam center capacity and rooms", icon: "MapPin", sortOrder: 33 },

  // 5. Managers & Staff
  { name: "staff.view", displayName: "View Staff & Roles", module: "ROLE", group: "Managers", action: "VIEW", resource: "staff", category: "SECURITY", description: "Can view organizational staff, roles, and hierarchy", icon: "UserCog", sortOrder: 40 },
  { name: "staff.create", displayName: "Create Staff Accounts", module: "ROLE", group: "Managers", action: "CREATE", resource: "staff", category: "SECURITY", description: "Can onboard operational managers and proctors", icon: "UserCog", sortOrder: 41 },
  { name: "staff.manage", displayName: "Manage Staff & Access Rights", module: "ROLE", group: "Managers", action: "MANAGE", resource: "staff", category: "SECURITY", description: "Can create roles, clone access rights, and assign granular permissions", icon: "UserCog", sortOrder: 42 },
  { name: "staff.delete", displayName: "Delete Staff Accounts", module: "ROLE", group: "Managers", action: "DELETE", resource: "staff", category: "SECURITY", description: "Can revoke access and terminate operational staff accounts", icon: "UserCog", sortOrder: 43 },

  // 6. Candidates
  { name: "candidates.view", displayName: "View Candidates", module: "CANDIDATE", group: "Candidates", action: "VIEW", resource: "candidates", category: "CORE", description: "Can view candidate details and registrations", icon: "Users", sortOrder: 50 },
  { name: "candidates.create", displayName: "Create Candidates", module: "CANDIDATE", group: "Candidates", action: "CREATE", resource: "candidates", category: "CORE", description: "Can register new examinee candidates", icon: "Users", sortOrder: 51 },
  { name: "candidates.update", displayName: "Update Candidates", module: "CANDIDATE", group: "Candidates", action: "UPDATE", resource: "candidates", category: "CORE", description: "Can modify candidate personal profiles and credentials", icon: "Users", sortOrder: 52 },
  { name: "candidates.delete", displayName: "Delete Candidates", module: "CANDIDATE", group: "Candidates", action: "DELETE", resource: "candidates", category: "CORE", description: "Can archive or delete examinee records", icon: "Users", sortOrder: 53 },
  { name: "candidates.manage", displayName: "Manage Candidates", module: "CANDIDATE", group: "Candidates", action: "MANAGE", resource: "candidates", category: "FEATURE", description: "Can register, import, and allocate candidates", icon: "Users", sortOrder: 54 },
  { name: "candidates.export", displayName: "Export Candidates", module: "CANDIDATE", group: "Candidates", action: "EXPORT", resource: "candidates", category: "REPORTING", description: "Can export candidate lists and attendance registers", icon: "Download", sortOrder: 55 },
  { name: "candidates.import", displayName: "Import Candidates", module: "CANDIDATE", group: "Candidates", action: "IMPORT", resource: "candidates", category: "FEATURE", description: "Can bulk import candidate lists from CSV/Excel", icon: "Upload", sortOrder: 56 },

  // 7. Subjects
  { name: "subjects.view", displayName: "View Subjects", module: "SUBJECT", group: "Subjects", action: "VIEW", resource: "subjects", category: "CORE", description: "Can browse academic curricula and exam subjects", icon: "BookOpen", sortOrder: 60 },
  { name: "subjects.create", displayName: "Create Subjects", module: "SUBJECT", group: "Subjects", action: "CREATE", resource: "subjects", category: "CORE", description: "Can define new evaluation subject categories", icon: "BookOpen", sortOrder: 61 },
  { name: "subjects.update", displayName: "Update Subjects", module: "SUBJECT", group: "Subjects", action: "UPDATE", resource: "subjects", category: "CORE", description: "Can edit course outlines and passing criteria", icon: "BookOpen", sortOrder: 62 },
  { name: "subjects.delete", displayName: "Delete Subjects", module: "SUBJECT", group: "Subjects", action: "DELETE", resource: "subjects", category: "CORE", description: "Can delete evaluation subject classifications", icon: "BookOpen", sortOrder: 63 },

  // 8. Question Bank
  { name: "question_bank.view", displayName: "View Question Bank", module: "QUESTION_BANK", group: "Question Bank", action: "VIEW", resource: "question_bank", category: "CORE", description: "Can access examination questions and pools", icon: "Database", sortOrder: 70 },
  { name: "question_bank.create", displayName: "Create Questions", module: "QUESTION_BANK", group: "Question Bank", action: "CREATE", resource: "question_bank", category: "CORE", description: "Can author and approve test items in question bank", icon: "Database", sortOrder: 71 },
  { name: "question_bank.update", displayName: "Update Questions", module: "QUESTION_BANK", group: "Question Bank", action: "UPDATE", resource: "question_bank", category: "CORE", description: "Can modify question items, options, and explanations", icon: "Database", sortOrder: 72 },
  { name: "question_bank.delete", displayName: "Delete Questions", module: "QUESTION_BANK", group: "Question Bank", action: "DELETE", resource: "question_bank", category: "CORE", description: "Can retire test items from item banks", icon: "Database", sortOrder: 73 },
  { name: "question_bank.import", displayName: "Import Questions", module: "QUESTION_BANK", group: "Question Bank", action: "IMPORT", resource: "question_bank", category: "FEATURE", description: "Can bulk import question pools from spreadsheets or Word files", icon: "Upload", sortOrder: 74 },

  // 9. Paper
  { name: "paper.manage", displayName: "Manage Exam Papers", module: "PAPER", group: "Paper", action: "MANAGE", resource: "paper", category: "CORE", description: "Can design and approve examination papers", icon: "FileText", sortOrder: 80 },
  { name: "paper.create", displayName: "Create Exam Papers", module: "PAPER", group: "Paper", action: "CREATE", resource: "paper", category: "CORE", description: "Can synthesize question blueprints into test sets", icon: "FileText", sortOrder: 81 },
  { name: "paper.update", displayName: "Update Exam Papers", module: "PAPER", group: "Paper", action: "UPDATE", resource: "paper", category: "CORE", description: "Can adjust section weights and scoring rules", icon: "FileText", sortOrder: 82 },
  { name: "paper.delete", displayName: "Delete Exam Papers", module: "PAPER", group: "Paper", action: "DELETE", resource: "paper", category: "CORE", description: "Can delete drafted or expired paper versions", icon: "FileText", sortOrder: 83 },

  // 10. Exam
  { name: "exams.view", displayName: "View Exams", module: "EXAM", group: "Exam", action: "VIEW", resource: "exams", category: "CORE", description: "Can view exam schedules and configurations", icon: "CalendarCheck", sortOrder: 90 },
  { name: "exams.create", displayName: "Create Exams", module: "EXAM", group: "Exam", action: "CREATE", resource: "exams", category: "CORE", description: "Can schedule and create new examinations", icon: "CalendarCheck", sortOrder: 91 },
  { name: "exams.update", displayName: "Update Exams", module: "EXAM", group: "Exam", action: "UPDATE", resource: "exams", category: "CORE", description: "Can reschedule shifts and adjust time limitations", icon: "CalendarCheck", sortOrder: 92 },
  { name: "exams.delete", displayName: "Delete Exams", module: "EXAM", group: "Exam", action: "DELETE", resource: "exams", category: "CORE", description: "Can cancel and remove scheduled exam shifts", icon: "CalendarCheck", sortOrder: 93 },
  { name: "exams.manage", displayName: "Manage Exam Execution", module: "EXAM", group: "Exam", action: "MANAGE", resource: "exams", category: "FEATURE", description: "Can monitor and manage active exam shifts", icon: "CalendarCheck", sortOrder: 94 },

  // 11. Result
  { name: "results.view", displayName: "View Results & Merit Lists", module: "RESULT", group: "Result", action: "VIEW", resource: "results", category: "REPORTING", description: "Can view computed exam scores and merit lists", icon: "Award", sortOrder: 100 },
  { name: "results.publish", displayName: "Publish & Approve Results", module: "RESULT", group: "Result", action: "MANAGE", resource: "results", category: "FEATURE", description: "Can approve and release exam result certifications", icon: "Award", sortOrder: 101 },
  { name: "results.export", displayName: "Export Result Summaries", module: "RESULT", group: "Result", action: "EXPORT", resource: "results", category: "REPORTING", description: "Can download result rosters and rank orders", icon: "Download", sortOrder: 102 },

  // 12. Certificate
  { name: "certificates.view", displayName: "View Certificates", module: "CERTIFICATE", group: "Certificate", action: "VIEW", resource: "certificates", category: "REPORTING", description: "Can inspect candidate achievement certificates", icon: "Award", sortOrder: 110 },
  { name: "certificates.generate", displayName: "Generate Certificates", module: "CERTIFICATE", group: "Certificate", action: "GENERATE", resource: "certificates", category: "FEATURE", description: "Can render printable PDF completion diplomas", icon: "Award", sortOrder: 111 },
  { name: "certificates.download", displayName: "Download Certificates", module: "CERTIFICATE", group: "Certificate", action: "DOWNLOAD", resource: "certificates", category: "REPORTING", description: "Can export achievement diplomas in batch", icon: "Download", sortOrder: 112 },

  // 13. Reports
  { name: "reports.view", displayName: "View Reports & Analytics", module: "REPORT", group: "Reports", action: "VIEW", resource: "reports", category: "REPORTING", description: "Can view analytical metrics, attendance summaries, and audit graphs", icon: "BarChart", sortOrder: 120 },
  { name: "reports.export", displayName: "Export Analytical Reports", module: "REPORT", group: "Reports", action: "EXPORT", resource: "reports", category: "REPORTING", description: "Can export statistical aggregations to CSV or PDF", icon: "Download", sortOrder: 121 },

  // 14. Billing
  { name: "billing.view", displayName: "View Billing & Invoices", module: "BILLING", group: "Billing", action: "VIEW", resource: "billing", category: "SYSTEM", description: "Can review historical invoices and transaction receipts", icon: "CreditCard", sortOrder: 130 },
  { name: "billing.manage", displayName: "Manage Payment Methods", module: "BILLING", group: "Billing", action: "MANAGE", resource: "billing", category: "SYSTEM", description: "Can add or modify tenant credit cards and payment terms", icon: "CreditCard", sortOrder: 131 },

  // 15. Subscription
  { name: "subscription.view", displayName: "View Subscription Status", module: "SUBSCRIPTION", group: "Subscription", action: "VIEW", resource: "subscription", category: "SYSTEM", description: "Can check active subscription tier and quota limitations", icon: "Award", sortOrder: 140 },
  { name: "subscription.upgrade", displayName: "Upgrade Subscription Plan", module: "SUBSCRIPTION", group: "Subscription", action: "UPDATE", resource: "subscription", category: "SYSTEM", description: "Can alter plan tier and scale user capacity", icon: "Award", sortOrder: 141 },

  // 16. Audit
  { name: "audit_logs.view", displayName: "View Audit Logs", module: "AUDIT_LOG", group: "Audit", action: "VIEW", resource: "audit_logs", category: "SECURITY", description: "Can review immutable compliance audit trails and system activity logs", icon: "History", sortOrder: 150 },
  { name: "audit_logs.export", displayName: "Export Compliance Logs", module: "AUDIT_LOG", group: "Audit", action: "EXPORT", resource: "audit_logs", category: "SECURITY", description: "Can download cryptographic audit archives", icon: "Download", sortOrder: 151 },

  // 17. Security
  { name: "security.view", displayName: "View Security Dashboards", module: "SECURITY", group: "Security", action: "VIEW", resource: "security", category: "SECURITY", description: "Can monitor login sessions and threat telemetry", icon: "ShieldAlert", sortOrder: 160 },
  { name: "security.manage", displayName: "Manage Security Policies", module: "SECURITY", group: "Security", action: "MANAGE", resource: "security", category: "SECURITY", description: "Can configure authentication rules and MFA enforcements", icon: "ShieldAlert", sortOrder: 161 },
  { name: "security.ip_rules", displayName: "Configure IP Whitelists", module: "SECURITY", group: "Security", action: "UPDATE", resource: "security", category: "SECURITY", description: "Can establish geo and network restriction lists", icon: "Globe", sortOrder: 162 },

  // 18. Notifications
  { name: "notifications.view", displayName: "View System Notifications", module: "NOTIFICATIONS", group: "Notifications", action: "VIEW", resource: "notifications", category: "CORE", description: "Can check alert queues and automated email dispatches", icon: "Bell", sortOrder: 170 },
  { name: "notifications.send", displayName: "Broadcast Broadcast Notifications", module: "NOTIFICATIONS", group: "Notifications", action: "CREATE", resource: "notifications", category: "FEATURE", description: "Can trigger SMS and email alerts to candidates or staff", icon: "Bell", sortOrder: 171 },

  // 19. Settings
  { name: "settings.view", displayName: "View Settings", module: "SYSTEM_SETTINGS", group: "Settings", action: "VIEW", resource: "settings", category: "SYSTEM", description: "Can read system configuration and tenant branding", icon: "Settings", sortOrder: 180 },
  { name: "settings.update", displayName: "Update Settings", module: "SYSTEM_SETTINGS", group: "Settings", action: "UPDATE", resource: "settings", category: "SYSTEM", description: "Can update tenant branding, SMTP, and security preferences", icon: "Settings", sortOrder: 181 },

  // 20. Support
  { name: "support.view", displayName: "View Support Tickets", module: "SUPPORT", group: "Support", action: "VIEW", resource: "support", category: "SYSTEM", description: "Can check candidate helpdesk disputes and queries", icon: "HelpCircle", sortOrder: 190 },
  { name: "support.tickets", displayName: "Manage Helpdesk Tickets", module: "SUPPORT", group: "Support", action: "MANAGE", resource: "support", category: "SYSTEM", description: "Can reply to and resolve examinee assistance tickets", icon: "HelpCircle", sortOrder: 191 },

  // 21. Live Monitoring
  { name: "live_monitoring.view", displayName: "Live Surveillance & Monitoring", module: "LIVE_MONITORING", group: "Live Monitoring", action: "VIEW", resource: "live_monitoring", category: "SECURITY", description: "Can access real-time video surveillance and incident logs", icon: "Activity", sortOrder: 200 },
  { name: "live_monitoring.record", displayName: "Record Surveillance Streams", module: "LIVE_MONITORING", group: "Live Monitoring", action: "MANAGE", resource: "live_monitoring", category: "SECURITY", description: "Can archive video feeds and snapshot suspect incidents", icon: "Video", sortOrder: 201 },

  // 22. Geo Monitoring
  { name: "geo_monitoring.view", displayName: "View Geo Monitoring Maps", module: "GEO_MONITORING", group: "Geo Monitoring", action: "VIEW", resource: "geo_monitoring", category: "SECURITY", description: "Can track candidate exam locations via live GPS maps", icon: "MapPin", sortOrder: 210 },
  { name: "geo_monitoring.track", displayName: "Enforce Geo Fencing Rules", module: "GEO_MONITORING", group: "Geo Monitoring", action: "MANAGE", resource: "geo_monitoring", category: "SECURITY", description: "Can configure geo fencing perimeters for online testing", icon: "Globe", sortOrder: 211 },

  // 23. Biometric
  { name: "attendance.view", displayName: "View Attendance & Biometrics", module: "ATTENDANCE", group: "Biometric", action: "VIEW", resource: "attendance", category: "SECURITY", description: "Can view shift attendance and biometric records", icon: "UserCheck", sortOrder: 220 },
  { name: "attendance.mark", displayName: "Mark Attendance & Verify Biometrics", module: "ATTENDANCE", group: "Biometric", action: "MANAGE", resource: "attendance", category: "SECURITY", description: "Can perform gate admit card and biometric verification", icon: "UserCheck", sortOrder: 221 },
  { name: "biometric.verify", displayName: "Manage Facial & Thumbprint matching", module: "BIOMETRIC", group: "Biometric", action: "VERIFY", resource: "biometric", category: "SECURITY", description: "Can calibrate confidence thresholds for automated face verification", icon: "Scan", sortOrder: 222 },

  // 24. Observer
  { name: "observer.view", displayName: "View Assigned Observer Shifts", module: "OBSERVER", group: "Observer", action: "VIEW", resource: "observer", category: "CORE", description: "Can read examination center inspection assignments", icon: "Eye", sortOrder: 230 },
  { name: "observer.assign", displayName: "Assign Inspecting Observers", module: "OBSERVER", group: "Observer", action: "ASSIGN", resource: "observer", category: "FEATURE", description: "Can deploy external supervisors to monitor exam venues", icon: "Eye", sortOrder: 231 },

  // 25. AI Proctor
  { name: "ai_proctor.view", displayName: "AI Proctoring Dashboard", module: "AI_PROCTORING", group: "AI Proctor", action: "VIEW", resource: "ai_proctor", category: "SECURITY", description: "Can inspect AI alerts, face verification anomalies, and cheating probability", icon: "ShieldCheck", sortOrder: 240 },
  { name: "ai_proctor.configure", displayName: "Configure AI Detection Policies", module: "AI_PROCTORING", group: "AI Proctor", action: "MANAGE", resource: "ai_proctor", category: "SECURITY", description: "Can adjust AI suspicion sensitivities for eye movement and tab switches", icon: "Cpu", sortOrder: 241 },

  // 26. Recruitment
  { name: "recruitment.view", displayName: "View Recruitment Pipelines", module: "RECRUITMENT", group: "Recruitment", action: "VIEW", resource: "recruitment", category: "FEATURE", description: "Can inspect hiring funnels and assessment scores", icon: "Briefcase", sortOrder: 250 },
  { name: "recruitment.manage", displayName: "Manage Hiring Evaluations", module: "RECRUITMENT", group: "Recruitment", action: "MANAGE", resource: "recruitment", category: "FEATURE", description: "Can progress tested candidates through hiring stages", icon: "Briefcase", sortOrder: 251 },

  // 27. API
  { name: "api_keys.view", displayName: "View Developer API Keys", module: "API", group: "API", action: "VIEW", resource: "api_keys", category: "SYSTEM", description: "Can inspect active developer webhooks and integration keys", icon: "Code", sortOrder: 260 },
  { name: "api_keys.create", displayName: "Generate REST API Keys", module: "API", group: "API", action: "CREATE", resource: "api_keys", category: "SYSTEM", description: "Can issue new authentication tokens for programmatic access", icon: "Code", sortOrder: 261 },
  { name: "api_keys.delete", displayName: "Revoke API Integrations", module: "API", group: "API", action: "DELETE", resource: "api_keys", category: "SYSTEM", description: "Can revoke secret API tokens to terminate external access", icon: "Code", sortOrder: 262 },

  // 28. Storage
  { name: "storage.view", displayName: "View Tenant Cloud Storage", module: "STORAGE", group: "Storage", action: "VIEW", resource: "storage", category: "SYSTEM", description: "Can inspect recorded surveillance volume and asset capacity", icon: "HardDrive", sortOrder: 270 },
  { name: "storage.manage", displayName: "Manage Retention & Archiving", module: "STORAGE", group: "Storage", action: "MANAGE", resource: "storage", category: "SYSTEM", description: "Can configure automated backup policies and storage buckets", icon: "HardDrive", sortOrder: 271 }
];

export const defaultSidebarItems = [
  { title: "Dashboard", route: "/company/dashboard", icon: "LayoutDashboard", permissionKey: "", featureKey: "", order: 1, isVisible: true },
  { title: "Subscription", route: "/company/subscription", icon: "Award", permissionKey: "", featureKey: "", order: 2, isVisible: true },
  { title: "Branches", route: "/company/branches", icon: "Building2", permissionKey: "branches.view", featureKey: "", order: 3, isVisible: true },
  { title: "Exam Centers", route: "/company/centers", icon: "MapPin", permissionKey: "centers.view", featureKey: "", order: 4, isVisible: true },
  { title: "Exams", route: "/company/exams", icon: "CalendarCheck", permissionKey: "exams.view", featureKey: "", order: 5, isVisible: true },
  { title: "Question Bank", route: "/company/question-banks", icon: "Database", permissionKey: "question_bank.view", featureKey: "", order: 6, isVisible: true },
  { title: "Candidates", route: "/company/candidates", icon: "Users", permissionKey: "candidates.view", featureKey: "", order: 7, isVisible: true },
  { title: "Live Monitoring", route: "/company/live-monitoring", icon: "Activity", permissionKey: "live_monitoring.view", featureKey: "liveMonitoring", order: 8, isVisible: true },
  { title: "AI Proctoring", route: "/company/ai-proctoring", icon: "ShieldCheck", permissionKey: "ai_proctor.view", featureKey: "basicAiProctoring", order: 9, isVisible: true },
  { title: "Attendance & Biometrics", route: "/company/attendance", icon: "UserCheck", permissionKey: "attendance.view", featureKey: "", order: 10, isVisible: true },
  { title: "Results & Merit List", route: "/company/results", icon: "Award", permissionKey: "results.view", featureKey: "", order: 11, isVisible: true },
  { title: "Reports & Analytics", route: "/company/reports", icon: "BarChart", permissionKey: "reports.view", featureKey: "", order: 12, isVisible: true },
  { title: "Staff & Access", route: "/company/staff", icon: "UserCog", permissionKey: "staff.view", featureKey: "", order: 13, isVisible: true },
  { title: "Audit Logs", route: "/company/audit-logs", icon: "History", permissionKey: "audit_logs.view", featureKey: "", order: 14, isVisible: true },
  { title: "Settings", route: "/company/settings", icon: "Settings", permissionKey: "settings.view", featureKey: "", order: 15, isVisible: true },
];

export async function seedRBAC() {
  try {
    // Seed default permissions with full Phase 4.1 enterprise metadata
    for (const p of defaultPermissions) {
      const resource = p.resource || p.name.split(".")[0] || "system";
      const defaultEndpoint = `/api/v1/${resource.replace(/_/g, "-")}`;
      const defaultMethod =
        p.action === "VIEW" || p.action === "READ"
          ? "GET"
          : p.action === "CREATE" || p.action === "GENERATE"
          ? "POST"
          : p.action === "DELETE"
          ? "DELETE"
          : "PATCH";
      const defaultRoute = `/company/${resource.replace(/_/g, "-")}`;

      await Permission.findOneAndUpdate(
        { permissionKey: p.name.toLowerCase() },
        {
          companyId: null,
          name: p.name,
          permissionKey: p.name.toLowerCase(),
          displayName: p.displayName,
          module: p.module,
          group: p.group || p.module.charAt(0) + p.module.slice(1).toLowerCase().replace(/_/g, " "),
          action: p.action,
          resource,
          category: p.category || "CORE",
          description: p.description,
          apiEndpoint: p.apiEndpoint || defaultEndpoint,
          httpMethod: p.httpMethod || defaultMethod,
          frontendRoute: p.frontendRoute || defaultRoute,
          icon: p.icon || "ShieldCheck",
          sortOrder: p.sortOrder || 10,
          isSystem: true,
          isSystemPermission: true,
          isVisible: true,
          status: PermissionStatus.ACTIVE,
          isDeleted: false,
        },
        { upsert: true, returnDocument: "after" }
      );
    }
    console.log("Enterprise permissions seeded successfully into database.");

    // Seed default sidebar items
    for (const item of defaultSidebarItems) {
      await SidebarItem.findOneAndUpdate(
        { companyId: null, route: item.route },
        { ...item, companyId: null, isSystem: true, isDeleted: false },
        { upsert: true, returnDocument: "after" }
      );
    }
    console.log("Dynamic MongoDB sidebar navigation seeded successfully.");

    // Seed default system platform roles (Phase 4.2)
    const systemRoles = [
      {
        name: "MASTER_ADMIN",
        displayName: "Master Admin",
        roleName: "Master Admin",
        roleCode: "MASTER_ADMIN",
        roleType: RoleType.MASTER_ADMIN,
        category: RoleCategory.PLATFORM,
        priority: 1,
        color: "#1e293b",
        icon: "ShieldAlert",
        description: "Global superuser access across all SaaS platform modules and settings",
        isSystem: true,
        systemRole: true,
        defaultRole: true,
        isCustom: false,
        status: RoleStatus.ACTIVE,
      },
      {
        name: "COMPANY_ADMIN",
        displayName: "Company Admin",
        roleName: "Company Admin",
        roleCode: "COMPANY_ADMIN",
        roleType: RoleType.COMPANY_ADMIN,
        category: RoleCategory.COMPANY,
        priority: 10,
        color: "#2D3E2C",
        icon: "Building",
        description: "Standard enterprise admin template for new client organizations",
        isSystem: true,
        systemRole: true,
        defaultRole: true,
        isCustom: false,
        status: RoleStatus.ACTIVE,
      },
    ];

    const allPermIds = (await Permission.find({ isDeleted: false, status: PermissionStatus.ACTIVE })).map((p: any) => p._id);
    for (const r of systemRoles) {
      await Role.findOneAndUpdate(
        { companyId: null, roleCode: r.roleCode },
        { ...r, companyId: null, permissions: r.roleCode === "MASTER_ADMIN" ? allPermIds : [], isDeleted: false },
        { upsert: true, returnDocument: "after" }
      );
    }
    console.log("Global System Roles seeded successfully into database.");
  } catch (err) {
    console.error("Error while seeding RBAC definitions:", err);
  }
}
