import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Permission Status
|--------------------------------------------------------------------------
*/

export enum PermissionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/*
|--------------------------------------------------------------------------
| Permission Categories
|--------------------------------------------------------------------------
*/

export enum PermissionCategory {
  CORE = "CORE",
  FEATURE = "FEATURE",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
  REPORTING = "REPORTING",
}

/*
|--------------------------------------------------------------------------
| Permission Groups
|--------------------------------------------------------------------------
*/

export enum PermissionGroup {
  DASHBOARD = "Dashboard",
  COMPANY = "Company",
  BRANCH = "Branch",
  CENTER = "Center",
  MANAGERS = "Managers",
  CANDIDATES = "Candidates",
  SUBJECTS = "Subjects",
  QUESTION_BANK = "Question Bank",
  PAPER = "Paper",
  EXAM = "Exam",
  RESULT = "Result",
  CERTIFICATE = "Certificate",
  REPORTS = "Reports",
  BILLING = "Billing",
  SUBSCRIPTION = "Subscription",
  AUDIT = "Audit",
  SECURITY = "Security",
  NOTIFICATIONS = "Notifications",
  SETTINGS = "Settings",
  SUPPORT = "Support",
  LIVE_MONITORING = "Live Monitoring",
  GEO_MONITORING = "Geo Monitoring",
  BIOMETRIC = "Biometric",
  OBSERVER = "Observer",
  AI_PROCTOR = "AI Proctor",
  RECRUITMENT = "Recruitment",
  API = "API",
  STORAGE = "Storage",
}

/*
|--------------------------------------------------------------------------
| System Modules
|--------------------------------------------------------------------------
*/

export enum PermissionModule {
  USER = "USER",
  COMPANY = "COMPANY",
  EMPLOYEE = "EMPLOYEE",
  ROLE = "ROLE",
  PERMISSION = "PERMISSION",
  BRANCH = "BRANCH",
  CENTER = "CENTER",
  SUBJECT = "SUBJECT",
  QUESTION = "QUESTION",
  QUESTION_BANK = "QUESTION_BANK",
  PAPER = "PAPER",
  EXAM = "EXAM",
  SHIFT = "SHIFT",
  CANDIDATE = "CANDIDATE",
  RESULT = "RESULT",
  DASHBOARD = "DASHBOARD",
  REPORT = "REPORT",
  LIVE_MONITORING = "LIVE_MONITORING",
  GEO_MONITORING = "GEO_MONITORING",
  AI_PROCTORING = "AI_PROCTORING",
  BIOMETRIC = "BIOMETRIC",
  BIOMETRIC_VERIFICATION = "BIOMETRIC_VERIFICATION",
  FACE_VERIFICATION = "FACE_VERIFICATION",
  ATTENDANCE = "ATTENDANCE",
  ADMIT_CARD = "ADMIT_CARD",
  EXAM_SUBMISSION = "EXAM_SUBMISSION",
  CANDIDATE_EXAM = "CANDIDATE_EXAM",
  CANDIDATE_ANSWER = "CANDIDATE_ANSWER",
  AUDIT_LOG = "AUDIT_LOG",
  ANALYTICS = "ANALYTICS",
  TRUST_SCORE = "TRUST_SCORE",
  COMPANY_SETTINGS = "COMPANY_SETTINGS",
  SUBSCRIPTION = "SUBSCRIPTION",
  STAFF = "STAFF",
  SETTINGS = "SETTINGS",
  SECURITY = "SECURITY",
  SUPPORT = "SUPPORT",
  BILLING = "BILLING",
  CERTIFICATE = "CERTIFICATE",
  NOTIFICATIONS = "NOTIFICATIONS",
  OBSERVER = "OBSERVER",
  RECRUITMENT = "RECRUITMENT",
  API = "API",
  STORAGE = "STORAGE",
}

/*
|--------------------------------------------------------------------------
| Permission Actions
|--------------------------------------------------------------------------
*/

export enum PermissionAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ASSIGN = "ASSIGN",
  APPROVE = "APPROVE",
  VERIFY = "VERIFY",
  PUBLISH = "PUBLISH",
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
  START = "START",
  STOP = "STOP",
  ACTIVATE = "ACTIVATE",
  DEACTIVATE = "DEACTIVATE",
  CLONE = "CLONE",
  EXECUTE = "EXECUTE",
  MANAGE = "MANAGE",
  VIEW = "VIEW",
  DOWNLOAD = "DOWNLOAD",
  GENERATE = "GENERATE",
  MONITOR = "MONITOR",
}

/*
|--------------------------------------------------------------------------
| Permission Interface
|--------------------------------------------------------------------------
*/

export interface IPermission {
  companyId?: Types.ObjectId | null;
  module: string | PermissionModule;
  group: string | PermissionGroup;
  action: string | PermissionAction;
  resource: string;
  category: string | PermissionCategory;
  name: string;
  permissionKey: string;
  displayName: string;
  description?: string;
  apiEndpoint?: string;
  httpMethod?: string;
  frontendRoute?: string;
  icon?: string;
  sortOrder: number;
  isSystem: boolean;
  isSystemPermission: boolean;
  isVisible: boolean;
  status: PermissionStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Permission Document
|--------------------------------------------------------------------------
*/

export type PermissionDocument = HydratedDocument<IPermission>;
