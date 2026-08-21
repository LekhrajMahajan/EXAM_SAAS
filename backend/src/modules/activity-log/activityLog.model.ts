import { Schema, model } from "mongoose";

import {
  IActivityLog,
  ActivityType,
  ActivityPriority,
  ActivityVisibility,
} from "./activityLog.types";

/*
|--------------------------------------------------------------------------
| Activity Log Schema
|--------------------------------------------------------------------------
*/

const activityLogSchema = new Schema<IActivityLog>(
  {
    /*
            |--------------------------------------------------------------------------
            | Activity
            |--------------------------------------------------------------------------
            */

    title: {
      type: String,

      required: true,

      trim: true,

      maxlength: 255,
    },

    description: {
      type: String,

      required: true,

      trim: true,

      maxlength: 5000,
    },

    activityType: {
      type: String,

      enum: Object.values(ActivityType),

      required: true,

      index: true,
    },

    module: {
      type: String,

      required: true,

      trim: true,

      index: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,

      index: true,
    },

    entityName: {
      type: String,

      trim: true,

      maxlength: 255,
    },

    /*
            |--------------------------------------------------------------------------
            | User Information
            |--------------------------------------------------------------------------
            */

    performedBy: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: false,

      index: true,
    },

    performedByRole: {
      type: String,

      required: false,

      index: true,
    },

    performedFor: {
      type: Schema.Types.ObjectId,

      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Company",

      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidate",

      index: true,
    },

    employeeId: {
      type: Schema.Types.ObjectId,

      ref: "Employee",

      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | UI
            |--------------------------------------------------------------------------
            */

    icon: {
      type: String,

      trim: true,

      default: "activity",
    },

    color: {
      type: String,

      trim: true,

      default: "#2563EB",
    },

    priority: {
      type: String,

      enum: Object.values(ActivityPriority),

      default: ActivityPriority.MEDIUM,

      index: true,
    },

    visibility: {
      type: String,

      enum: Object.values(ActivityVisibility),

      default: ActivityVisibility.COMPANY,

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Metadata
            |--------------------------------------------------------------------------
            */

    metadata: {
      type: Schema.Types.Mixed,

      default: {},
    },

    /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    isDeleted: {
      type: Boolean,

      default: false,

      index: true,
    },

    deletedAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

activityLogSchema.index({
  activityType: 1,

  createdAt: -1,
});

activityLogSchema.index({
  module: 1,

  createdAt: -1,
});

activityLogSchema.index({
  performedBy: 1,

  createdAt: -1,
});

activityLogSchema.index({
  candidateId: 1,

  createdAt: -1,
});

activityLogSchema.index({
  employeeId: 1,

  createdAt: -1,
});



activityLogSchema.index({
  examId: 1,

  createdAt: -1,
});

activityLogSchema.index({
  visibility: 1,

  priority: 1,
});

activityLogSchema.index({
  isDeleted: 1,

  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;
