import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Paper Status
|--------------------------------------------------------------------------
*/

export enum PaperStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  ARCHIVED = "ARCHIVED",
}

/*
|--------------------------------------------------------------------------
| Paper Approval Status
|--------------------------------------------------------------------------
*/

export enum PaperApprovalStatus {
  DRAFT = "DRAFT",

  PENDING_APPROVAL = "PENDING_APPROVAL",

  SUBMITTED = "SUBMITTED",

  REVIEWED = "REVIEWED",

  APPROVED = "APPROVED",

  PUBLISHED = "PUBLISHED",

  REJECTED = "REJECTED",
}

/*
|--------------------------------------------------------------------------
| Paper Section
|--------------------------------------------------------------------------
*/

export interface IPaperSection {
  sectionCode: string;

  sectionName: string;

  instructions?: string;

  totalQuestions: number;

  totalMarks: number;

  optionalQuestions: number;

  displayOrder: number;
}

/*
|--------------------------------------------------------------------------
| Paper Interface
|--------------------------------------------------------------------------
*/

export interface IPaper {
  companyId: Types.ObjectId;

  subjectId: Types.ObjectId;

  examId?: Types.ObjectId;

  assignedTo?: Types.ObjectId;

  paperCode: string;

  paperName: string;

  description?: string;

  duration: number;

  totalQuestions: number;

  totalMarks: number;

  passingMarks: number;

  negativeMarking: boolean;

  negativeMarks: number;

  shuffleQuestions: boolean;

  shuffleOptions: boolean;

  instructions: string[];

  sections: IPaperSection[];

  approvalStatus: PaperApprovalStatus;

  status: PaperStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Paper Document
|--------------------------------------------------------------------------
*/

export type PaperDocument = HydratedDocument<IPaper>;
