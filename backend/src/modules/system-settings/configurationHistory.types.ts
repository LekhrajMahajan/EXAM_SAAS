import { HydratedDocument, Types } from "mongoose";
import { SettingCategory } from "./systemSettings.types";

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
  configurationName: string; // E.g., 'GENERAL_SETTINGS', 'BACKUP_SETTINGS', etc.
  module: SettingCategory;
  category: SettingCategory;
  
  changedBy?: Types.ObjectId;
  
  oldValue: unknown;
  newValue: unknown;
  
  status: ConfigurationStatus;
  approvalStatus: ConfigurationApprovalStatus;
  
  reason?: string;
  
  reviewer?: Types.ObjectId;
  approvalNotes?: string;
  approvalTimestamp?: Date;
  
  version: number;
  versionNotes?: string;
  versionTags?: string[];
  
  rollbackPoint: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export type ConfigurationHistoryDocument = HydratedDocument<IConfigurationHistory>;
