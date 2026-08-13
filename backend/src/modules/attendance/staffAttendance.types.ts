import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Staff Attendance Enums
|--------------------------------------------------------------------------
*/

export enum StaffAttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  HALF_DAY = "HALF_DAY",
  LEAVE = "LEAVE",
  HOLIDAY = "HOLIDAY",
  ON_DUTY = "ON_DUTY",
  EMERGENCY_REPLACEMENT = "EMERGENCY_REPLACEMENT",
  CANCELLED = "CANCELLED",
  AUTO_MARKED = "AUTO_MARKED",
}

export enum AttendanceCaptureType {
  QR_CHECKIN = "QR_CHECKIN",
  QR_CHECKOUT = "QR_CHECKOUT",
  FACE_VERIFICATION = "FACE_VERIFICATION",
  BIOMETRIC_DEVICE = "BIOMETRIC_DEVICE",
  MANUAL_OVERRIDE = "MANUAL_OVERRIDE",
  GEO_VALIDATION = "GEO_VALIDATION",
}

export enum StaffLeaveType {
  EMERGENCY_LEAVE = "EMERGENCY_LEAVE",
  MEDICAL_LEAVE = "MEDICAL_LEAVE",
  CASUAL_LEAVE = "CASUAL_LEAVE",
}

export enum RequestWorkflowStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum RosterViewType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  SHIFT_WISE = "SHIFT_WISE",
  CENTER_WISE = "CENTER_WISE",
  BRANCH_WISE = "BRANCH_WISE",
  ROLE_WISE = "ROLE_WISE",
  ROOM_WISE = "ROOM_WISE",
  EMPLOYEE_WISE = "EMPLOYEE_WISE",
}

/*
|--------------------------------------------------------------------------
| Staff Attendance Interface
|--------------------------------------------------------------------------
*/

export interface IStaffAttendance {
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId | null;
  centerId?: Types.ObjectId | null;
  examId: Types.ObjectId;
  shiftId?: Types.ObjectId | null;
  roomId?: Types.ObjectId | null;
  assignmentId: Types.ObjectId;
  employeeId: Types.ObjectId;
  employeeCode?: string;
  employeeName?: string;
  role: string;

  attendanceStatus: StaffAttendanceStatus | string;
  captureType: AttendanceCaptureType | string;

  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  reportingTimeLimit?: Date | null;
  lateMinutes?: number;
  isLate: boolean;
  latePenaltyApplied: boolean;
  trustScoreImpact?: number;

  qrValidated: boolean;
  faceVerified: boolean;
  faceScore?: number;
  geoValidated: boolean;
  latitude?: number;
  longitude?: number;
  distanceFromCenterMeters?: number;

  deviceId?: string;
  ipAddress?: string;
  photoUrl?: string;
  remarks?: string;
  overrideBy?: Types.ObjectId | null;

  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type StaffAttendanceDocument = HydratedDocument<IStaffAttendance>;

/*
|--------------------------------------------------------------------------
| Leave Request Interface
|--------------------------------------------------------------------------
*/

export interface ILeaveRequest {
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId | null;
  centerId?: Types.ObjectId | null;
  employeeId: Types.ObjectId;
  employeeName?: string;
  role?: string;
  leaveType: StaffLeaveType | string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: RequestWorkflowStatus | string;
  approvedBy?: Types.ObjectId | null;
  approvedAt?: Date | null;
  rejectionReason?: string;
  affectedAssignmentIds?: Types.ObjectId[];
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LeaveRequestDocument = HydratedDocument<ILeaveRequest>;

/*
|--------------------------------------------------------------------------
| Duty Swap Interface
|--------------------------------------------------------------------------
*/

export interface IDutySwap {
  companyId: Types.ObjectId;
  examId: Types.ObjectId;
  requesterEmployeeId: Types.ObjectId;
  requesterName?: string;
  requesterAssignmentId: Types.ObjectId;
  targetEmployeeId: Types.ObjectId;
  targetName?: string;
  targetAssignmentId?: Types.ObjectId | null;
  role: string;
  centerMatch: boolean;
  roleMatch: boolean;
  reason: string;
  status: RequestWorkflowStatus | string;
  conflictWarnings?: string[];
  approvedBy?: Types.ObjectId | null;
  approvedAt?: Date | null;
  rejectionReason?: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type DutySwapDocument = HydratedDocument<IDutySwap>;

/*
|--------------------------------------------------------------------------
| Emergency Replacement Interface
|--------------------------------------------------------------------------
*/

export interface IEmergencyReplacement {
  companyId: Types.ObjectId;
  examId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  originalEmployeeId: Types.ObjectId;
  originalEmployeeName?: string;
  replacementEmployeeId: Types.ObjectId;
  replacementEmployeeName?: string;
  role: string;
  reason: string;
  status: RequestWorkflowStatus | string;
  suggestedStaffScores?: Array<{
    employeeId: Types.ObjectId;
    employeeName: string;
    trustScore: number;
    workloadHours: number;
    experienceScore: number;
  }>;
  assignedBy?: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EmergencyReplacementDocument = HydratedDocument<IEmergencyReplacement>;
