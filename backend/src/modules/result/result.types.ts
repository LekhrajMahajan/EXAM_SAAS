import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Result Status
|--------------------------------------------------------------------------
*/

export enum ResultStatus {
  DRAFT = "DRAFT",
  EVALUATED = "EVALUATED",
  PUBLISHED = "PUBLISHED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/*
|--------------------------------------------------------------------------
| Pass Status
|--------------------------------------------------------------------------
*/

export enum PassStatus {
  PASSED = "PASSED",
  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Evaluation Method
|--------------------------------------------------------------------------
*/

export enum EvaluationMethod {
  AUTO = "AUTO",
  MANUAL = "MANUAL",
}

/*
|--------------------------------------------------------------------------
| Result Interface
|--------------------------------------------------------------------------
*/

export interface IResult {
  /*
    |--------------------------------------------------------------------------
    | References
    |--------------------------------------------------------------------------
    */

  attendanceId: Types.ObjectId;

  submissionId: Types.ObjectId;

  candidateId: Types.ObjectId;

  candidateAssignmentId: Types.ObjectId;

  examId: Types.ObjectId;

  paperId: Types.ObjectId;

  subjectId: Types.ObjectId;

  companyId: Types.ObjectId;
  examCenterId: Types.ObjectId;

  examRoomId: Types.ObjectId;

  /*
    |--------------------------------------------------------------------------
    | Evaluation
    |--------------------------------------------------------------------------
    */

  totalQuestions: number;

  attemptedQuestions: number;

  correctAnswers: number;

  wrongAnswers: number;

  unansweredQuestions: number;

  totalMarks: number;

  marksObtained: number;

  negativeMarks: number;

  passingMarks: number;

  percentage: number;

  rank?: number;

  /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

  passStatus: PassStatus;

  resultStatus: ResultStatus;

  /*
    |--------------------------------------------------------------------------
    | Evaluation Info
    |--------------------------------------------------------------------------
    */

  evaluationMethod: EvaluationMethod;

  evaluationVersion: number;

  evaluationDuration?: number;

  /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */

  submittedAt?: Date;

  evaluatedAt?: Date;

  publishedAt?: Date;

  approvedAt?: Date;

  /*
    |--------------------------------------------------------------------------
    | Approval
    |--------------------------------------------------------------------------
    */

  approvedBy?: Types.ObjectId;

  publishedBy?: Types.ObjectId;

  remarks?: string;

  /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  generatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Result Document
|--------------------------------------------------------------------------
*/

export type ResultDocument = HydratedDocument<IResult>;
