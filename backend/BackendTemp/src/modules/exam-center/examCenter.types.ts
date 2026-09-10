import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Exam Center Status
|--------------------------------------------------------------------------
*/

export enum ExamCenterStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  CLOSED = "CLOSED",
}

/*
|--------------------------------------------------------------------------
| Exam Center
|--------------------------------------------------------------------------
*/

export interface IExamCenter {
  examId: Types.ObjectId;

  shiftId: Types.ObjectId;

  centerId: Types.ObjectId;

  centerCapacity: number;

  allocatedCandidates: number;

  availableSeats: number;

  reportingTime: Date;

  gateClosingTime: Date;

  startTime: Date;

  endTime: Date;

  status: ExamCenterStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Document
|--------------------------------------------------------------------------
*/

export type ExamCenterDocument = HydratedDocument<IExamCenter>;
