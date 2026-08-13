import { HydratedDocument, Types } from "mongoose";

export enum StaffAssignmentRole {
  EXAM_MANAGER = "EXAM_MANAGER",
  PAPER_SETTER = "PAPER_SETTER",
  OBSERVER = "OBSERVER",
  CHIEF_OBSERVER = "CHIEF_OBSERVER",
  INVIGILATOR = "INVIGILATOR",
  SUPERVISOR = "SUPERVISOR",
  BIOMETRIC_VERIFIER = "BIOMETRIC_VERIFIER",
  TECHNICAL_MANAGER = "TECHNICAL_MANAGER",
  TECHNICAL_STAFF = "TECHNICAL_STAFF",
  ENTRY_CHECKER = "ENTRY_CHECKER",
  HELP_DESK = "HELP_DESK",
  SECURITY = "SECURITY",
  LAB_ASSISTANT = "LAB_ASSISTANT",
  MEDICAL_OFFICER = "MEDICAL_OFFICER",
  COMMAND_CENTER = "COMMAND_CENTER",
  AI_PROCTOR = "AI_PROCTOR",
}

export enum AssignmentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PUBLISHED = "PUBLISHED",
  NOTIFIED = "NOTIFIED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  REPLACEMENT_REQUESTED = "REPLACEMENT_REQUESTED",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
}

export enum AssignmentType {
  MANUAL = "MANUAL",
  BULK = "BULK",
  AUTO = "AUTO",
  REASSIGNMENT = "REASSIGNMENT",
  REPLACEMENT = "REPLACEMENT",
  EMERGENCY = "EMERGENCY",
  TEMPORARY = "TEMPORARY",
}

export interface IStaffAssignment {
  companyId: Types.ObjectId;
  examId: Types.ObjectId;
  branchId?: Types.ObjectId | null;
  centerId?: Types.ObjectId | null;
  building?: string;
  floor?: string;
  roomId?: Types.ObjectId | null;
  shiftId?: Types.ObjectId | null;
  role: StaffAssignmentRole | string;
  employeeId: Types.ObjectId;
  employeeCode?: string;
  employeeName?: string;
  assignmentType: AssignmentType | string;
  status: AssignmentStatus | string;
  scheduledDate?: Date;
  startTime?: string;
  endTime?: string;
  rejectionReason?: string;
  replacementReason?: string;
  replacedByAssignmentId?: Types.ObjectId | null;
  instructions?: string;
  reportingTime?: string;
  qrCheckInCode?: string;
  qrCheckOutCode?: string;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  attendancePrepared: boolean;
  conflictWarnings?: string[];
  workloadHours?: number;
  trustScoreAtAssignment?: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type StaffAssignmentDocument = HydratedDocument<IStaffAssignment>;

export interface ConflictDetectionResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
