export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  GENERATE = 'GENERATE',
  PUBLISH = 'PUBLISH',
  SUBMIT = 'SUBMIT',
  START = 'START',
  END = 'END',
  DOWNLOAD = 'DOWNLOAD',
  SEND = 'SEND',
  VERIFY = 'VERIFY',
  READ = 'READ',
}

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface AuditLog {
  _id: string;
  action: AuditAction;
  module: string;
  entityId?: string;
  entityName?: string;
  description: string;
  performedBy?: string;
  performedByRole?: string;
  performedFor?: string;
  companyId?: string;
  branchId?: string;
  examId?: string;
  candidateId?: string;
  employeeId?: string;
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
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}
