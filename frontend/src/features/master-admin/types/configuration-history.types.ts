export enum ConfigurationStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  ROLLBACK = "ROLLBACK",
}

export enum ConfigurationApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NOT_REQUIRED = "NOT_REQUIRED",
}

export interface IConfigurationHistory {
  _id: string;
  configurationName: string;
  module: string;
  category: string;
  
  changedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  
  oldValue: any;
  newValue: any;
  
  status: ConfigurationStatus;
  approvalStatus: ConfigurationApprovalStatus;
  
  reason?: string;
  
  reviewer?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvalNotes?: string;
  approvalTimestamp?: string;
  
  version: number;
  versionNotes?: string;
  versionTags?: string[];
  
  rollbackPoint: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationHistoryFilters {
  page?: number;
  limit?: number;
  module?: string;
  category?: string;
  status?: ConfigurationStatus;
  approvalStatus?: ConfigurationApprovalStatus;
  search?: string;
}

export interface ConfigurationComparison {
  v1: any;
  v2: any;
  diff: Record<string, { old: any; new: any }>;
}
