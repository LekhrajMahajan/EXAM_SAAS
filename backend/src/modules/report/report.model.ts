import { Schema, model } from "mongoose";

import {
  ReportFormat,
  ReportStatus,
  ReportType,
  ReportVisibility,
} from "./report.types";

const reportSchema = new Schema(
  {
    reportType: {
      type: String,

      enum: Object.values(ReportType),

      required: true,

      index: true,
    },

    reportName: {
      type: String,

      required: true,

      trim: true,
    },

    status: {
      type: String,

      enum: Object.values(ReportStatus),

      default: ReportStatus.PENDING,

      index: true,
    },

    format: {
      type: String,

      enum: Object.values(ReportFormat),

      required: true,
    },

    visibility: {
      type: String,

      enum: Object.values(ReportVisibility),

      default: ReportVisibility.PRIVATE,
    },

    generatedBy: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Company",

      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",

      index: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,

      ref: "Center",

      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      index: true,
    },

    fileId: {
      type: Schema.Types.ObjectId,

      ref: "FileStorage",
    },

    generatedAt: {
      type: Date,

      default: Date.now,
    },

    completedAt: {
      type: Date,
    },

    filters: {
      type: Schema.Types.Mixed,

      default: {},
    },

    metadata: {
      type: Schema.Types.Mixed,

      default: {},
    },

    error: {
      type: String,

      trim: true,
    },

    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],

    downloadCount: {
      type: Number,
      default: 0,
    },

    isScheduled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    versionKey: false,
  },
);

reportSchema.index({
  reportType: 1,

  generatedAt: -1,
});

reportSchema.index({
  companyId: 1,

  reportType: 1,
});

reportSchema.index({
  generatedBy: 1,

  createdAt: -1,
});

const Report = model(
  "Report",

  reportSchema,
);

export default Report;
