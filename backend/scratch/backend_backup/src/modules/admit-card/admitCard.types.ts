import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Admit Card Status
|--------------------------------------------------------------------------
*/

export enum AdmitCardStatus {
  PENDING = "PENDING",

  GENERATED = "GENERATED",

  DOWNLOADED = "DOWNLOADED",

  PRINTED = "PRINTED",

  VERIFIED = "VERIFIED",

  CANCELLED = "CANCELLED",
}

/*
|--------------------------------------------------------------------------
| Admit Card
|--------------------------------------------------------------------------
*/

export interface IAdmitCard {
  candidateAssignmentId: Types.ObjectId;

  candidateId: Types.ObjectId;

  examId: Types.ObjectId;

  shiftId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  examRoomId: Types.ObjectId;

  seatAllocationId: Types.ObjectId;

  admitCardNumber: string;

  qrCode: string;

  barcode: string;

  pdfUrl: string;

  downloadCount: number;

  printCount: number;

  lastDownloadedAt?: Date | null;

  lastPrintedAt?: Date | null;

  generatedAt: Date;

  generatedBy?: Types.ObjectId;

  status: AdmitCardStatus;

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

export type AdmitCardDocument = HydratedDocument<IAdmitCard>;
