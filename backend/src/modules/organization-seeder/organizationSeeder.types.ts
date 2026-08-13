import { Document, Types } from "mongoose";

export interface SeederStepLog {
  stepName: string;
  action: string;
  timestamp: Date;
  createdResources: number;
  executionTimeMs: number;
  status: "SUCCESS" | "FAILED" | "ROLLEDBACK";
  errorMessage?: string;
}

export interface DashboardWidgetConfig {
  widgetId: string;
  title: string;
  category: string;
  roleRequired: string[];
  planRequired: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  isEnabled: boolean;
  layout: { x: number; y: number; w: number; h: number };
}

export interface SecurityPolicyConfig {
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
  };
  sessionTimeoutMinutes: number;
  mfaPolicy: "DISABLED" | "OPTIONAL" | "MANDATORY";
  ipPolicy: "OPEN" | "WHITELIST_ONLY" | "GEO_FENCED";
  browserPolicy: "STANDARD" | "RESTRICTED" | "SECURE_EXAM_BROWSER";
  deviceTrust: "ANY" | "REGISTERED_ONLY" | "BIOMETRIC_TOKEN";
  auditPolicy: "STANDARD" | "STRICT" | "ENTERPRISE_COMPLIANT";
}

export interface IOrganizationInitialization extends Document {
  companyId: Types.ObjectId;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "RESEEDED";
  planCode: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  stepLogs: SeederStepLog[];
  createdRoles: string[];
  createdBranches: string[];
  createdCenters: string[];
  defaultDepartments: string[];
  defaultDesignations: string[];
  dashboardWidgets: DashboardWidgetConfig[];
  storageFolders: string[];
  securityPolicies: SecurityPolicyConfig;
  initializedAt: Date;
  reseededAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
