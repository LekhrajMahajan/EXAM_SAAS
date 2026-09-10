import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Shift Status
|--------------------------------------------------------------------------
*/

export enum ShiftStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/*
|--------------------------------------------------------------------------
| Shift Interface
|--------------------------------------------------------------------------
*/

export interface IShift {
  companyId: Types.ObjectId;
  centerId: Types.ObjectId;

  shiftName: string;

  shiftCode: string;

  startTime: string;

  endTime: string;

  reportingTime: string;

  gateClosingTime: string;

  description?: string;

  status: ShiftStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Shift Document
|--------------------------------------------------------------------------
*/

export type ShiftDocument = HydratedDocument<IShift>;
