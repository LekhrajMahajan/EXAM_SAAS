import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Exam Shift Status
|--------------------------------------------------------------------------
*/

export enum ExamShiftStatus {
  SCHEDULED = "SCHEDULED",

  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  CANCELLED = "CANCELLED",
}

/*
|--------------------------------------------------------------------------
| Exam Shift
|--------------------------------------------------------------------------
*/

export interface IExamShift {
  examId: Types.ObjectId;

  shiftCode: string;

  shiftName: string;

  shiftNumber: number;

  reportingTime: string;

  gateClosingTime: string;

  startTime: string;

  endTime: string;

  duration: number;

  totalCandidates: number;

  totalCenters: number;

  totalRooms: number;

  totalSeats: number;

  status: ExamShiftStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Exam Shift Document
|--------------------------------------------------------------------------
*/

export type ExamShiftDocument = HydratedDocument<IExamShift>;
