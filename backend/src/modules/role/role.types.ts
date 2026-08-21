import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Role Status
|--------------------------------------------------------------------------
*/

export enum RoleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/*
|--------------------------------------------------------------------------
| Default System Roles
|--------------------------------------------------------------------------
*/

export enum SystemRole {
  SUPER_ADMIN = "MASTER_ADMIN",
  MASTER_ADMIN = "MASTER_ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  CENTER_MANAGER = "CENTER_MANAGER",
  EXAM_MANAGER = "EXAM_MANAGER",
  PAPER_SETTER = "PAPER_SETTER",
  QUESTION_SETTER = "QUESTION_SETTER",
  BIOMETRIC_VERIFIER = "BIOMETRIC_VERIFIER",
  ENTRY_CHECKER = "ENTRY_CHECKER",
  OBSERVER = "OBSERVER",
  GOVT_AUTHORITY = "GOVT_AUTHORITY",
  TECHNICAL_MANAGER = "TECHNICAL_MANAGER",
  INVIGILATOR = "INVIGILATOR",
  AI_PROCTOR = "AI_PROCTOR",
  COMMAND_CENTER = "COMMAND_CENTER",
  CANDIDATE = "CANDIDATE",
}

/*
|--------------------------------------------------------------------------
| Role Types & Categories (Phase 4.2)
|--------------------------------------------------------------------------
*/

export enum RoleType {
  MASTER_ADMIN = "MASTER_ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  ADMIN = "ADMIN",
  CENTER_MANAGER = "CENTER_MANAGER",
  EXAM_MANAGER = "EXAM_MANAGER",
  PAPER_SETTER = "PAPER_SETTER",
  QUESTION_SETTER = "QUESTION_SETTER",
  BIOMETRIC_VERIFIER = "BIOMETRIC_VERIFIER",
  ENTRY_CHECKER = "ENTRY_CHECKER",
  OBSERVER = "OBSERVER",
  GOVT_AUTHORITY = "GOVT_AUTHORITY",
  TECHNICAL_MANAGER = "TECHNICAL_MANAGER",
  INVIGILATOR = "INVIGILATOR",
  AI_PROCTOR = "AI_PROCTOR",
  COMMAND_CENTER = "COMMAND_CENTER",
  CANDIDATE = "CANDIDATE",
  CUSTOM = "CUSTOM",
}

export enum RoleCategory {
  PLATFORM = "PLATFORM",
  COMPANY = "COMPANY",
  OPERATIONAL = "OPERATIONAL",
  CANDIDATE = "CANDIDATE",
  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| Role Interface
|--------------------------------------------------------------------------
*/

export interface IRole {
  companyId?: Types.ObjectId | null;

  name: string;

  displayName: string;

  roleName?: string;

  roleCode: string;

  roleType?: RoleType | string;

  category?: RoleCategory | string;

  parentRole?: Types.ObjectId | null;

  hierarchyLevel: number;

  priority?: number;

  color?: string;

  icon?: string;

  description?: string;

  permissions: Types.ObjectId[];

  isSystem: boolean;

  systemRole?: boolean;

  defaultRole?: boolean;

  isCustom?: boolean;

  clonedFrom?: Types.ObjectId | null;

  status: RoleStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Role Document
|--------------------------------------------------------------------------
*/

export type RoleDocument = HydratedDocument<IRole>;
