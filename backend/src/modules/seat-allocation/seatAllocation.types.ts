import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Seat Allocation Status
|--------------------------------------------------------------------------
*/

export enum SeatAllocationStatus {
  AVAILABLE = "AVAILABLE",

  RESERVED = "RESERVED",

  OCCUPIED = "OCCUPIED",

  BLOCKED = "BLOCKED",
}

/*
|--------------------------------------------------------------------------
| Seat Allocation
|--------------------------------------------------------------------------
*/

export interface ISeatAllocation {
  examId: Types.ObjectId;

  shiftId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  examRoomId: Types.ObjectId;

  seatId: Types.ObjectId;

  seatNumber: string;

  rowNumber: number;

  columnNumber: number;

  candidateId?: Types.ObjectId | null;

  allocationStatus: SeatAllocationStatus;

  remarks?: string;

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

export type SeatAllocationDocument = HydratedDocument<ISeatAllocation>;
