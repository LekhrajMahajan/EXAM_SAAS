import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Activity Type
|--------------------------------------------------------------------------
*/

export enum ActivityType {
  LOGIN = "LOGIN",

  LOGOUT = "LOGOUT",

  CREATE = "CREATE",

  UPDATE = "UPDATE",

  DELETE = "DELETE",

  APPROVE = "APPROVE",

  REJECT = "REJECT",

  GENERATE = "GENERATE",

  DOWNLOAD = "DOWNLOAD",

  SUBMIT = "SUBMIT",

  PUBLISH = "PUBLISH",

  SEND = "SEND",

  VERIFY = "VERIFY",
}

/*
|--------------------------------------------------------------------------
| Activity Priority
|--------------------------------------------------------------------------
*/

export enum ActivityPriority {
  LOW = "LOW",

  MEDIUM = "MEDIUM",

  HIGH = "HIGH",
}

/*
|--------------------------------------------------------------------------
| Activity Visibility
|--------------------------------------------------------------------------
*/

export enum ActivityVisibility {
  PRIVATE = "PRIVATE",

  COMPANY = "COMPANY",

  PUBLIC = "PUBLIC",
}

/*
|--------------------------------------------------------------------------
| Activity Log
|--------------------------------------------------------------------------
*/

export interface IActivityLog {
  title: string;

  description: string;

  activityType: ActivityType;

  module: string;

  entityId?: Types.ObjectId;

  entityName?: string;

  performedBy?: Types.ObjectId;

  performedByRole?: string;

  performedFor?: Types.ObjectId;

  companyId?: Types.ObjectId;
  candidateId?: Types.ObjectId;

  employeeId?: Types.ObjectId;

  examId?: Types.ObjectId;

  icon?: string;

  color?: string;

  priority: ActivityPriority;

  visibility: ActivityVisibility;

  metadata?: Record<string, unknown>;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type ActivityLogDocument = HydratedDocument<IActivityLog>;
