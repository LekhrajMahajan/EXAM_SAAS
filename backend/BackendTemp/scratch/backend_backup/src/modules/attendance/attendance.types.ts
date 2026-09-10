import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Attendance Status
|--------------------------------------------------------------------------
*/

export enum AttendanceStatus {
  PENDING = "PENDING",

  PRESENT = "PRESENT",

  ABSENT = "ABSENT",

  LATE = "LATE",

  DISQUALIFIED = "DISQUALIFIED",

  CHECKED_OUT = "CHECKED_OUT",
}

/*
|--------------------------------------------------------------------------
| Verification Status
|--------------------------------------------------------------------------
*/

export enum VerificationStatus {
  PENDING = "PENDING",

  SUCCESS = "SUCCESS",

  FAILED = "FAILED",

  BYPASSED = "BYPASSED",
}

/*
|--------------------------------------------------------------------------
| Attendance Interface
|--------------------------------------------------------------------------
*/

export interface IAttendance {
  candidateAssignmentId: Types.ObjectId;

  admitCardId: Types.ObjectId;

  candidateId: Types.ObjectId;

  examId: Types.ObjectId;

  shiftId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  examRoomId: Types.ObjectId;

  seatAllocationId: Types.ObjectId;

  attendanceStatus: AttendanceStatus;

  biometricVerification: VerificationStatus;

  faceVerification: VerificationStatus;

  qrVerification: VerificationStatus;

  manualVerification: VerificationStatus;

  checkInTime?: Date | null;

  checkOutTime?: Date | null;

  verifiedBy?: Types.ObjectId | null;

  verifiedAt?: Date | null;

  deviceId?: string;

  scannerId?: string;

  latitude?: number;

  longitude?: number;

  ipAddress?: string;

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

export type AttendanceDocument = HydratedDocument<IAttendance>;
