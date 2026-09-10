import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Audit Action
|--------------------------------------------------------------------------
*/

export enum AuditAction {
  CREATE = "CREATE",

  UPDATE = "UPDATE",

  DELETE = "DELETE",

  RESTORE = "RESTORE",

  LOGIN = "LOGIN",

  LOGOUT = "LOGOUT",

  PASSWORD_CHANGE = "PASSWORD_CHANGE",

  APPROVE = "APPROVE",

  REJECT = "REJECT",

  GENERATE = "GENERATE",

  PUBLISH = "PUBLISH",

  SUBMIT = "SUBMIT",

  START = "START",

  END = "END",

  DOWNLOAD = "DOWNLOAD",

  SEND = "SEND",

  VERIFY = "VERIFY",

  READ = "READ",

  EXPORT = "EXPORT",
}

/*
|--------------------------------------------------------------------------
| Audit Severity
|--------------------------------------------------------------------------
*/

export enum AuditSeverity {
  LOW = "LOW",

  MEDIUM = "MEDIUM",

  HIGH = "HIGH",

  CRITICAL = "CRITICAL",
}

/*
|--------------------------------------------------------------------------
| Audit Status
|--------------------------------------------------------------------------
*/

export enum AuditStatus {
  SUCCESS = "SUCCESS",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Audit Log
|--------------------------------------------------------------------------
*/

export interface IAuditLog {
  action: AuditAction;

  module: string;

  entityId?: Types.ObjectId;

  entityName?: string;

  description: string;

  performedBy?: Types.ObjectId;

  performedByRole?: string;

  performedFor?: Types.ObjectId;

  companyId?: Types.ObjectId;
  examId?: Types.ObjectId;

  candidateId?: Types.ObjectId;

  employeeId?: Types.ObjectId;

  ipAddress?: string;

  userAgent?: string;

  deviceType?: string;

  browser?: string;

  operatingSystem?: string;

  requestMethod?: string;

  requestUrl?: string;

  requestBody?: Record<string, unknown>;

  responseStatus?: number;

  oldData?: Record<string, unknown>;

  newData?: Record<string, unknown>;

  metadata?: Record<string, unknown>;

  severity: AuditSeverity;

  status: AuditStatus;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type AuditLogDocument = HydratedDocument<IAuditLog>;
