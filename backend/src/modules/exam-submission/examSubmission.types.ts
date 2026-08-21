import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Submission Status
|--------------------------------------------------------------------------
*/

export enum SubmissionStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  SUBMITTED = "SUBMITTED",
  AUTO_SUBMITTED = "AUTO_SUBMITTED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

/*
|--------------------------------------------------------------------------
| Exam Submission
|--------------------------------------------------------------------------
*/

export interface IExamSubmission {
  attendanceId: Types.ObjectId;

  candidateId: Types.ObjectId;

  candidateAssignmentId: Types.ObjectId;

  examId: Types.ObjectId;

  paperId: Types.ObjectId;

  subjectId: Types.ObjectId;

  companyId: Types.ObjectId;
  examCenterId: Types.ObjectId;

  examRoomId: Types.ObjectId;

  startedAt: Date;

  submittedAt?: Date;

  totalTime: number;

  remainingTime: number;

  answeredQuestions: number;

  unansweredQuestions: number;

  reviewQuestions: number;

  totalQuestions: number;

  submissionStatus: SubmissionStatus;

  autoSubmitted: boolean;

  browserInfo?: string;

  ipAddress?: string;

  deviceInfo?: string;

  lastHeartbeatAt?: Date;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type ExamSubmissionDocument = HydratedDocument<IExamSubmission>;
