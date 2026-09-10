import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

export enum ExamRoomStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  BLOCKED = "BLOCKED",
}

/*
|--------------------------------------------------------------------------
| Exam Room
|--------------------------------------------------------------------------
*/

export interface IExamRoom {
  examId: Types.ObjectId;

  shiftId: Types.ObjectId;

  centerId: Types.ObjectId;

  roomId: Types.ObjectId;

  roomCapacity: number;

  allocatedCandidates: number;

  availableSeats: number;

  roomNumber: string;

  floorNumber?: number;

  buildingName?: string;

  status: ExamRoomStatus;

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

export type ExamRoomDocument = HydratedDocument<IExamRoom>;
