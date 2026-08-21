import { Schema, model } from "mongoose";
import { IStaffAssignment, AssignmentStatus, AssignmentType, StaffAssignmentRole } from "./staffAssignment.types";
import { BaseSchemaFields } from "../../shared/base.schema";

const StaffAssignmentSchema = new Schema<IStaffAssignment>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
      index: true,
    },
    building: {
      type: String,
      trim: true,
      default: "",
    },
    floor: {
      type: String,
      trim: true,
      default: "",
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
      index: true,
    },
    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "Shift",
      default: null,
      index: true,
    },
    role: {
      type: String,
      required: true,
      index: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    employeeCode: {
      type: String,
      trim: true,
    },
    employeeName: {
      type: String,
      trim: true,
    },
    assignmentType: {
      type: String,
      enum: Object.values(AssignmentType),
      default: AssignmentType.MANUAL,
    },
    status: {
      type: String,
      enum: Object.values(AssignmentStatus),
      default: AssignmentStatus.PENDING,
      index: true,
    },
    scheduledDate: {
      type: Date,
      index: true,
    },
    startTime: {
      type: String,
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    replacementReason: {
      type: String,
      trim: true,
      default: "",
    },
    replacedByAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "StaffAssignment",
      default: null,
    },
    instructions: {
      type: String,
      trim: true,
      default: "",
    },
    reportingTime: {
      type: String,
      trim: true,
    },
    qrCheckInCode: {
      type: String,
      trim: true,
    },
    qrCheckOutCode: {
      type: String,
      trim: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    attendancePrepared: {
      type: Boolean,
      default: false,
    },
    conflictWarnings: [
      {
        type: String,
      },
    ],
    workloadHours: {
      type: Number,
      default: 4,
    },
    trustScoreAtAssignment: {
      type: Number,
      default: 100,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound indexes for rapid searching and conflict detection
StaffAssignmentSchema.index({ companyId: 1, employeeId: 1, isDeleted: 1 });
StaffAssignmentSchema.index({ companyId: 1, examId: 1, shiftId: 1, isDeleted: 1 });
StaffAssignmentSchema.index({ companyId: 1, centerId: 1, roomId: 1, isDeleted: 1 });
StaffAssignmentSchema.index({ scheduledDate: 1, startTime: 1, endTime: 1 });

const StaffAssignment = model<IStaffAssignment>("StaffAssignment", StaffAssignmentSchema);

export default StaffAssignment;
