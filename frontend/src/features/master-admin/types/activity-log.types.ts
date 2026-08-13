export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  GENERATE = 'GENERATE',
  DOWNLOAD = 'DOWNLOAD',
  SUBMIT = 'SUBMIT',
  PUBLISH = 'PUBLISH',
  SEND = 'SEND',
  VERIFY = 'VERIFY',
}

export enum ActivityPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ActivityVisibility {
  PRIVATE = 'PRIVATE',
  COMPANY = 'COMPANY',
  PUBLIC = 'PUBLIC',
}

export interface ActivityLog {
  _id: string;
  title: string;
  description: string;
  activityType: ActivityType;
  module: string;
  entityId?: string;
  entityName?: string;
  performedBy?: string;
  performedByRole?: string;
  performedFor?: string;
  companyId?: string;
  branchId?: string;
  candidateId?: string;
  employeeId?: string;
  examId?: string;
  icon?: string;
  color?: string;
  priority: ActivityPriority;
  visibility: ActivityVisibility;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogsResponse {
  data: ActivityLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}

export interface ActivityDashboardData {
  total: number;
  createActivities: number;
  updateActivities: number;
  highPriorityActivities: number;
}

export interface ActivityDashboardResponse {
  data: ActivityDashboardData;
  success: boolean;
  message: string;
}

export interface ActivityStatisticsData extends ActivityDashboardData {
  createPercentage: string;
  updatePercentage: string;
  highPriorityPercentage: string;
}

export interface ActivityStatisticsResponse {
  data: ActivityStatisticsData;
  success: boolean;
  message: string;
}

