import { Schema, model } from "mongoose";

import {
  IBiometricVerification,
  BiometricVerificationStatus,
  BiometricType,
  LivenessStatus,
} from "./biometricVerification.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const VerificationHistorySchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    biometricType: {
      type: String,
      enum: Object.values(BiometricType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BiometricVerificationStatus),
      required: true,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    liveness: {
      type: String,
      enum: Object.values(LivenessStatus),
    },
    imageUrl: String,
    deviceId: String,
    ipAddress: String,
    userAgent: String,
    remarks: String,
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/*
|--------------------------------------------------------------------------
| Schema
|--------------------------------------------------------------------------
*/

const BiometricVerificationSchema = new Schema<IBiometricVerification>(
  {
    /*
            |--------------------------------------------------------------------------
            | References
            |--------------------------------------------------------------------------
            */

    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
      index: true,
    },

    admitCardId: {
      type: Schema.Types.ObjectId,
      ref: "AdmitCard",
      required: true,
      index: true,
    },

    candidateAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "CandidateAssignment",
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      required: true,
      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
    },

    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "ExamShift",
    },

    trustScoreId: {
      type: Schema.Types.ObjectId,
      ref: "TrustScore",
    },

    geoMonitoringId: {
      type: Schema.Types.ObjectId,
      ref: "GeoMonitoring",
    },

    /*
            |--------------------------------------------------------------------------
            | Verification
            |--------------------------------------------------------------------------
            */

    biometricType: {
      type: String,
      enum: Object.values(BiometricType),
      required: true,
      default: BiometricType.MULTI_FACTOR,
    },

    verificationStatus: {
      type: String,
      enum: Object.values(BiometricVerificationStatus),
      default: BiometricVerificationStatus.PENDING,
      index: true,
    },

    livenessStatus: {
      type: String,
      enum: Object.values(LivenessStatus),
      default: LivenessStatus.PENDING,
      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Matching Scores
            |--------------------------------------------------------------------------
            */

    fingerprintScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    irisScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    faceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /*
            |--------------------------------------------------------------------------
            | Images & Migrated Fields
            |--------------------------------------------------------------------------
            */

    enrolledFaceImage: {
      type: String,
    },

    latestFaceImage: {
      type: String,
    },

    /*
            |--------------------------------------------------------------------------
            | Retry Policy
            |--------------------------------------------------------------------------
            */

    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxRetryLimit: {
      type: Number,
      default: 3,
      min: 1,
    },

    totalAttempts: {
      type: Number,
      default: 0,
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },

    /*
            |--------------------------------------------------------------------------
            | Device Details
            |--------------------------------------------------------------------------
            */

    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    scannerId: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Geo Location
            |--------------------------------------------------------------------------
            */

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    lastVerifiedAt: {
      type: Date,
    },

    history: [VerificationHistorySchema],

    /*
            |--------------------------------------------------------------------------
            | Base Fields
            |--------------------------------------------------------------------------
            */

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Unique Constraints
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Candidate Search
|--------------------------------------------------------------------------
*/







/*
|--------------------------------------------------------------------------
| Verification Dashboard
|--------------------------------------------------------------------------
*/

BiometricVerificationSchema.index({
  examId: 1,
  verificationStatus: 1,
});

BiometricVerificationSchema.index({
  examCenterId: 1,
  verificationStatus: 1,
});

BiometricVerificationSchema.index({
  biometricType: 1,
  verificationStatus: 1,
});

/*
|--------------------------------------------------------------------------
| Retry Monitoring
|--------------------------------------------------------------------------
*/

BiometricVerificationSchema.index({
  retryCount: -1,
});

BiometricVerificationSchema.index({
  maxRetryLimit: 1,
});

/*
|--------------------------------------------------------------------------
| Device Monitoring
|--------------------------------------------------------------------------
*/

BiometricVerificationSchema.index({
  deviceId: 1,
});

BiometricVerificationSchema.index({
  scannerId: 1,
});

BiometricVerificationSchema.index({
  ipAddress: 1,
});

/*
|--------------------------------------------------------------------------
| Geo Monitoring
|--------------------------------------------------------------------------
*/

BiometricVerificationSchema.index({
  latitude: 1,
  longitude: 1,
});

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

BiometricVerificationSchema.index({
  overallScore: -1,
});

BiometricVerificationSchema.index({
  verifiedAt: -1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const BiometricVerification = model<IBiometricVerification>(
  "BiometricVerification",
  BiometricVerificationSchema,
);

export default BiometricVerification;
