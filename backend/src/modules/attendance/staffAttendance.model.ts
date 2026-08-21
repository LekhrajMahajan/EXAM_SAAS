import { Schema, model } from "mongoose";
import {
  IStaffAttendance,
  ILeaveRequest,
  IDutySwap,
  IEmergencyReplacement,
  StaffAttendanceStatus,
  AttendanceCaptureType,
  StaffLeaveType,
  RequestWorkflowStatus,
} from "./staffAttendance.types";

/*
|--------------------------------------------------------------------------
| Staff Attendance Schema
|--------------------------------------------------------------------------
*/

const staffAttendanceSchema = new Schema<IStaffAttendance>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", default: null, index: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    shiftId: { type: Schema.Types.ObjectId, ref: "Shift", default: null, index: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", default: null },
    assignmentId: { type: Schema.Types.ObjectId, ref: "StaffAssignment", required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    employeeCode: { type: String, trim: true, default: "" },
    employeeName: { type: String, trim: true, default: "" },
    role: { type: String, required: true, index: true },

    attendanceStatus: {
      type: String,
      enum: Object.values(StaffAttendanceStatus),
      default: StaffAttendanceStatus.PRESENT,
      index: true,
    },
    captureType: {
      type: String,
      enum: Object.values(AttendanceCaptureType),
      default: AttendanceCaptureType.QR_CHECKIN,
    },

    checkInTime: { type: Date, default: Date.now, index: true },
    checkOutTime: { type: Date, default: null, index: true },
    reportingTimeLimit: { type: Date, default: null },
    lateMinutes: { type: Number, default: 0 },
    isLate: { type: Boolean, default: false, index: true },
    latePenaltyApplied: { type: Boolean, default: false },
    trustScoreImpact: { type: Number, default: 0 },

    qrValidated: { type: Boolean, default: false },
    faceVerified: { type: Boolean, default: false },
    faceScore: { type: Number, default: 0 },
    geoValidated: { type: Boolean, default: false },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    distanceFromCenterMeters: { type: Number, default: null },

    deviceId: { type: String, trim: true, default: "" },
    ipAddress: { type: String, trim: true, default: "" },
    photoUrl: { type: String, trim: true, default: "" },
    remarks: { type: String, trim: true, default: "" },
    overrideBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

staffAttendanceSchema.index({ companyId: 1, employeeId: 1, checkInTime: -1 });
staffAttendanceSchema.index({ companyId: 1, examId: 1, shiftId: 1, attendanceStatus: 1 });
staffAttendanceSchema.index({ companyId: 1, centerId: 1, isDeleted: 1 });

export const StaffAttendanceModel = model<IStaffAttendance>("StaffAttendance", staffAttendanceSchema);

/*
|--------------------------------------------------------------------------
| Leave Request Schema
|--------------------------------------------------------------------------
*/

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", default: null, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    employeeName: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    leaveType: {
      type: String,
      enum: Object.values(StaffLeaveType),
      default: StaffLeaveType.CASUAL_LEAVE,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    reason: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: Object.values(RequestWorkflowStatus),
      default: RequestWorkflowStatus.PENDING,
      index: true,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: "" },
    affectedAssignmentIds: [{ type: Schema.Types.ObjectId, ref: "StaffAssignment" }],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

leaveRequestSchema.index({ companyId: 1, employeeId: 1, status: 1 });
export const LeaveRequestModel = model<ILeaveRequest>("StaffLeaveRequest", leaveRequestSchema);

/*
|--------------------------------------------------------------------------
| Duty Swap Schema
|--------------------------------------------------------------------------
*/

const dutySwapSchema = new Schema<IDutySwap>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    requesterEmployeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    requesterName: { type: String, trim: true, default: "" },
    requesterAssignmentId: { type: Schema.Types.ObjectId, ref: "StaffAssignment", required: true },
    targetEmployeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    targetName: { type: String, trim: true, default: "" },
    targetAssignmentId: { type: Schema.Types.ObjectId, ref: "StaffAssignment", default: null },
    role: { type: String, required: true },
    centerMatch: { type: Boolean, default: true },
    roleMatch: { type: Boolean, default: true },
    reason: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: Object.values(RequestWorkflowStatus),
      default: RequestWorkflowStatus.PENDING,
      index: true,
    },
    conflictWarnings: [{ type: String }],
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: "" },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

dutySwapSchema.index({ companyId: 1, examId: 1, status: 1 });
export const DutySwapModel = model<IDutySwap>("StaffDutySwap", dutySwapSchema);

/*
|--------------------------------------------------------------------------
| Emergency Replacement Schema
|--------------------------------------------------------------------------
*/

const emergencyReplacementSchema = new Schema<IEmergencyReplacement>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: "StaffAssignment", required: true },
    originalEmployeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    originalEmployeeName: { type: String, trim: true, default: "" },
    replacementEmployeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    replacementEmployeeName: { type: String, trim: true, default: "" },
    role: { type: String, required: true },
    reason: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: Object.values(RequestWorkflowStatus),
      default: RequestWorkflowStatus.APPROVED,
      index: true,
    },
    suggestedStaffScores: [
      {
        employeeId: { type: Schema.Types.ObjectId },
        employeeName: { type: String },
        trustScore: { type: Number },
        workloadHours: { type: Number },
        experienceScore: { type: Number },
      },
    ],
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false }
);

emergencyReplacementSchema.index({ companyId: 1, examId: 1 });
export const EmergencyReplacementModel = model<IEmergencyReplacement>("EmergencyReplacement", emergencyReplacementSchema);
