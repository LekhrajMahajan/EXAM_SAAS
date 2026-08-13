// frontend types mirroring backend permission.types.ts

export type PermissionStatus = 'ACTIVE' | 'INACTIVE';

export type PermissionGroup =
  | 'Dashboard'
  | 'Company'
  | 'Branch'
  | 'Center'
  | 'Managers'
  | 'Candidates'
  | 'Subjects'
  | 'Question Bank'
  | 'Paper'
  | 'Exam'
  | 'Result'
  | 'Certificate'
  | 'Reports'
  | 'Billing'
  | 'Subscription'
  | 'Audit'
  | 'Security'
  | 'Notifications'
  | 'Settings'
  | 'Support'
  | 'Live Monitoring'
  | 'Geo Monitoring'
  | 'Biometric'
  | 'Observer'
  | 'AI Proctor'
  | 'Recruitment'
  | 'API'
  | 'Storage'
  | (string & {});

export type PermissionCategory =
  | 'CORE'
  | 'FEATURE'
  | 'REPORTING'
  | 'SYSTEM'
  | 'INTEGRATION'
  | 'SECURITY'
  | (string & {});

export type PermissionModule =
  | 'USER'
  | 'COMPANY'
  | 'EMPLOYEE'
  | 'ROLE'
  | 'PERMISSION'
  | 'BRANCH'
  | 'CENTER'
  | 'SUBJECT'
  | 'QUESTION'
  | 'QUESTION_BANK'
  | 'PAPER'
  | 'EXAM'
  | 'SHIFT'
  | 'CANDIDATE'
  | 'RESULT'
  | 'CERTIFICATE'
  | 'DASHBOARD'
  | 'REPORT'
  | 'BILLING'
  | 'SUBSCRIPTION'
  | 'AUDIT_LOG'
  | 'SECURITY'
  | 'NOTIFICATIONS'
  | 'SYSTEM_SETTINGS'
  | 'SUPPORT'
  | 'LIVE_MONITORING'
  | 'GEO_MONITORING'
  | 'BIOMETRIC'
  | 'ATTENDANCE'
  | 'OBSERVER'
  | 'AI_PROCTORING'
  | 'RECRUITMENT'
  | 'API'
  | 'STORAGE'
  | 'SETTINGS'
  | (string & {});

export type PermissionAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'ASSIGN'
  | 'APPROVE'
  | 'VERIFY'
  | 'PUBLISH'
  | 'IMPORT'
  | 'EXPORT'
  | 'START'
  | 'STOP'
  | 'MANAGE'
  | 'GENERATE'
  | 'DOWNLOAD'
  | 'VIEW'
  | (string & {});

export interface Permission {
  _id: string;
  companyId?: string | null;
  name: string;
  permissionKey?: string;
  displayName: string;
  module: PermissionModule;
  group?: PermissionGroup;
  action: PermissionAction;
  resource?: string;
  category?: PermissionCategory;
  description?: string;
  apiEndpoint?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
  frontendRoute?: string;
  icon?: string;
  sortOrder?: number;
  isSystem: boolean;
  isSystemPermission?: boolean;
  isVisible?: boolean;
  status: PermissionStatus;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionStatistics {
  total: number;
  active: number;
  inactive: number;
  systemPermissions: number;
  customPermissions: number;
}

export const GROUPS_LIST: PermissionGroup[] = [
  "Dashboard",
  "Company",
  "Branch",
  "Center",
  "Managers",
  "Candidates",
  "Subjects",
  "Question Bank",
  "Paper",
  "Exam",
  "Result",
  "Certificate",
  "Reports",
  "Billing",
  "Subscription",
  "Audit",
  "Security",
  "Notifications",
  "Settings",
  "Support",
  "Live Monitoring",
  "Geo Monitoring",
  "Biometric",
  "Observer",
  "AI Proctor",
  "Recruitment",
  "API",
  "Storage",
];

export const MODULES_LIST: PermissionModule[] = [
  "DASHBOARD",
  "COMPANY",
  "BRANCH",
  "CENTER",
  "ROLE",
  "CANDIDATE",
  "SUBJECT",
  "QUESTION_BANK",
  "PAPER",
  "EXAM",
  "RESULT",
  "CERTIFICATE",
  "REPORT",
  "BILLING",
  "SUBSCRIPTION",
  "AUDIT_LOG",
  "SECURITY",
  "NOTIFICATIONS",
  "SYSTEM_SETTINGS",
  "SUPPORT",
  "LIVE_MONITORING",
  "GEO_MONITORING",
  "BIOMETRIC",
  "OBSERVER",
  "AI_PROCTORING",
  "RECRUITMENT",
  "API",
  "STORAGE",
];

export const ACTIONS_LIST: PermissionAction[] = [
  "VIEW",
  "READ",
  "CREATE",
  "UPDATE",
  "DELETE",
  "MANAGE",
  "GENERATE",
  "DOWNLOAD",
  "EXPORT",
  "IMPORT",
  "VERIFY",
  "APPROVE",
  "PUBLISH",
  "ASSIGN",
];

export const CATEGORIES_LIST: PermissionCategory[] = [
  "CORE",
  "FEATURE",
  "REPORTING",
  "SYSTEM",
  "SECURITY",
  "INTEGRATION",
];

export const HTTP_METHODS_LIST = ["GET", "POST", "PATCH", "PUT", "DELETE"];

