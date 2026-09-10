import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Subject Status
|--------------------------------------------------------------------------
*/

export enum SubjectStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  ARCHIVED = "ARCHIVED",
}

/*
|--------------------------------------------------------------------------
| Subject Interface
|--------------------------------------------------------------------------
*/

export interface ISubject {
  companyId: Types.ObjectId;

  subjectCode: string;

  subjectName: string;

  subjectShortName: string;

  description?: string;

  language?: string;

  icon?: string;

  color?: string;

  duration: number;

  totalMarks: number;

  passingMarks: number;

  negativeMarking: boolean;

  negativeMarks: number;

  questionCount: number;

  status: SubjectStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Subject Document
|--------------------------------------------------------------------------
*/

export type SubjectDocument = HydratedDocument<ISubject>;
