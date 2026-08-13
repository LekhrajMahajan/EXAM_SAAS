import { Schema, model } from "mongoose";

import {
  IncidentSeverity,
  IncidentStatus,
  ObserverStatus,
  ObserverType,
} from "./observer.types";

const incidentSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidate",

      required: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      required: true,
    },

    shiftId: {
      type: Schema.Types.ObjectId,

      ref: "ExamShift",

      required: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,

      ref: "Center",

      required: true,
    },

    severity: {
      type: String,

      enum: Object.values(IncidentSeverity),

      required: true,
    },

    title: {
      type: String,

      required: true,

      trim: true,
    },

    description: {
      type: String,

      required: true,

      trim: true,
    },

    attachment: {
      type: String,
    },

    status: {
      type: String,

      enum: Object.values(IncidentStatus),

      default: IncidentStatus.OPEN,
    },

    reportedAt: {
      type: Date,

      default: Date.now,
    },
  },

  {
    _id: false,
  },
);

const observerSchema = new Schema(
  {
    observerId: {
      type: Schema.Types.ObjectId,

      ref: "Employee",

      required: true,

      unique: true,

      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Company",

      required: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",
    },

    centerId: {
      type: Schema.Types.ObjectId,

      ref: "Center",

      required: true,
    },

    shiftId: {
      type: Schema.Types.ObjectId,

      ref: "ExamShift",

      required: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      required: true,
    },

    type: {
      type: String,

      enum: Object.values(ObserverType),

      default: ObserverType.ASSISTANT,
    },

    status: {
      type: String,

      enum: Object.values(ObserverStatus),

      default: ObserverStatus.PENDING,
    },

    checkInAt: {
      type: Date,
    },

    checkOutAt: {
      type: Date,
    },

    attendanceVerified: {
      type: Boolean,

      default: false,
    },

    trustScoreId: {
      type: Schema.Types.ObjectId,

      ref: "TrustScore",
    },

    incidents: [incidentSchema],

    remarks: {
      type: String,

      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

observerSchema.index({
  observerId: 1,

  shiftId: 1,
});

observerSchema.index({
  centerId: 1,

  examId: 1,
});

const Observer = model(
  "Observer",

  observerSchema,
);

export default Observer;
