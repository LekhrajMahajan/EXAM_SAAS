import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Merit Status
|--------------------------------------------------------------------------
*/

export enum MeritStatus {
  DRAFT = "DRAFT",

  GENERATED = "GENERATED",

  PUBLISHED = "PUBLISHED",

  CANCELLED = "CANCELLED",

  LOCKED = "LOCKED",

  ARCHIVED = "ARCHIVED",
}

/*
|--------------------------------------------------------------------------
| Merit List
|--------------------------------------------------------------------------
*/

export interface IMeritList {
  /*
    |--------------------------------------------------------------------------
    | References
    |--------------------------------------------------------------------------
    */

  examId: Types.ObjectId;

  resultId: Types.ObjectId;

  certificateId: Types.ObjectId;

  candidateId: Types.ObjectId;

  companyId: Types.ObjectId;

  branchId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  subjectId: Types.ObjectId;

  /*
    |--------------------------------------------------------------------------
    | Ranking
    |--------------------------------------------------------------------------
    */

  meritNumber: string;

  rank: number;

  overallRank: number;

  stateRank: number;

  districtRank: number;

  centerRank: number;

  /*
    |--------------------------------------------------------------------------
    | Score
    |--------------------------------------------------------------------------
    */

  marksObtained: number;

  percentage: number;

  correctAnswers: number;

  wrongAnswers: number;

  negativeMarks: number;

  tieBreakerScore: number;

  /*
    |--------------------------------------------------------------------------
    | Classification
    |--------------------------------------------------------------------------
    */

  category: string;

  gender: string;

  meritStatus: MeritStatus;

  /*
    |--------------------------------------------------------------------------
    | Publication
    |--------------------------------------------------------------------------
    */

  publishedAt?: Date;

  publishedBy?: Types.ObjectId;

  remarks?: string;

  /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Document
|--------------------------------------------------------------------------
*/

export type MeritListDocument = HydratedDocument<IMeritList>;
