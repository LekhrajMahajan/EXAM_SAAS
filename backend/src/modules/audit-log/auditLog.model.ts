import { Schema, model } from "mongoose";

import {
  IAuditLog,
  AuditAction,
  AuditSeverity,
  AuditStatus,
} from "./auditLog.types";

/*
|--------------------------------------------------------------------------
| Audit Log Schema
|--------------------------------------------------------------------------
*/

const auditLogSchema = new Schema<IAuditLog>(
  {
    /*
            |--------------------------------------------------------------------------
            | Action
            |--------------------------------------------------------------------------
            */

    action: {
      type: String,

      enum: Object.values(AuditAction),

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

    description: {
      type: String,

      required: true,

      trim: true,

      maxlength: 5000,
    },

    /*
            |--------------------------------------------------------------------------
            | User
            |--------------------------------------------------------------------------
            */

    performedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",

      index: true,
    },

    performedByRole: {
      type: String,

      trim: true,

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

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",

      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

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

    /*
            |--------------------------------------------------------------------------
            | Request
            |--------------------------------------------------------------------------
            */

    ipAddress: {
      type: String,

      trim: true,
    },

    userAgent: {
      type: String,

      trim: true,
    },

    deviceType: {
      type: String,

      trim: true,
    },

    browser: {
      type: String,

      trim: true,
    },

    operatingSystem: {
      type: String,

      trim: true,
    },

    requestMethod: {
      type: String,

      trim: true,
    },

    requestUrl: {
      type: String,

      trim: true,
    },

    requestBody: {
      type: Schema.Types.Mixed,

      default: {},
    },

    responseStatus: {
      type: Number,
    },

    /*
            |--------------------------------------------------------------------------
            | Changes
            |--------------------------------------------------------------------------
            */

    oldData: {
      type: Schema.Types.Mixed,

      default: {},
    },

    newData: {
      type: Schema.Types.Mixed,

      default: {},
    },

    metadata: {
      type: Schema.Types.Mixed,

      default: {},
    },

    /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

    severity: {
      type: String,

      enum: Object.values(AuditSeverity),

      default: AuditSeverity.LOW,

      index: true,
    },

    status: {
      type: String,

      enum: Object.values(AuditStatus),

      default: AuditStatus.SUCCESS,

      index: true,
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
| Compound Indexes
|--------------------------------------------------------------------------
*/

auditLogSchema.index({
  module: 1,

  action: 1,
});

auditLogSchema.index({
  companyId: 1,

  createdAt: -1,
});

auditLogSchema.index({
  performedBy: 1,

  createdAt: -1,
});

auditLogSchema.index({
  candidateId: 1,

  createdAt: -1,
});

auditLogSchema.index({
  employeeId: 1,

  createdAt: -1,
});

auditLogSchema.index({
  examId: 1,

  createdAt: -1,
});

auditLogSchema.index({
  severity: 1,

  status: 1,
});

auditLogSchema.index({
  action: 1,

  createdAt: -1,
});

auditLogSchema.index({
  isDeleted: 1,

  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);

export default AuditLog;
