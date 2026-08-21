import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Seat Status
|--------------------------------------------------------------------------
*/

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",

  RESERVED = "RESERVED",

  OCCUPIED = "OCCUPIED",

  BLOCKED = "BLOCKED",

  DISABLED = "DISABLED",
}

/*
|--------------------------------------------------------------------------
| Seat Type
|--------------------------------------------------------------------------
*/

export enum SeatType {
  NORMAL = "NORMAL",

  VIP = "VIP",

  WHEELCHAIR = "WHEELCHAIR",

  OBSERVER = "OBSERVER",

  SERVER = "SERVER",
}

/*
|--------------------------------------------------------------------------
| Seat Interface
|--------------------------------------------------------------------------
*/

export interface ISeat {
  companyId: Types.ObjectId;
  centerId: Types.ObjectId;

  roomId: Types.ObjectId;

  seatNumber: string;

  row: string;

  column: number;

  seatType: SeatType;

  status: SeatStatus;

  isBlocked: boolean;

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
| Seat Document
|--------------------------------------------------------------------------
*/

export type SeatDocument = HydratedDocument<ISeat>;
