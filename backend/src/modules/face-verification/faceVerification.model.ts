import { Schema, model } from "mongoose";

import {
  IFaceVerification,
  FaceVerificationStatus,
  FaceLivenessStatus,
  FaceSource,
  SpoofDetectionStatus,
} from "./faceVerification.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Schema
|--------------------------------------------------------------------------
*/

const FaceVerificationSchema = new Schema<IFaceVerification>(
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

    biometricVerificationId: {
      type: Schema.Types.ObjectId,
      ref: "BiometricVerification",
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

    /*
            |--------------------------------------------------------------------------
            | Verification
            |--------------------------------------------------------------------------
            */

    faceSource: {
      type: String,
      enum: Object.values(FaceSource),
      default: FaceSource.LIVE_CAMERA,
    },

    verificationStatus: {
      type: String,
      enum: Object.values(FaceVerificationStatus),
      default: FaceVerificationStatus.PENDING,
      index: true,
    },

    livenessStatus: {
      type: String,
      enum: Object.values(FaceLivenessStatus),
      default: FaceLivenessStatus.PENDING,
      index: true,
    },

    spoofDetection: {
      type: String,
      enum: Object.values(SpoofDetectionStatus),
      default: SpoofDetectionStatus.UNKNOWN,
      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | AI Matching
            |--------------------------------------------------------------------------
            */

    confidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    faceDistance: {
      type: Number,
      default: 1,
      min: 0,
    },

    registeredEmbedding: {
      type: [Number],
      default: [],
    },

    capturedEmbedding: {
      type: [Number],
      default: [],
    },

    /*
            |--------------------------------------------------------------------------
            | Images
            |--------------------------------------------------------------------------
            */

    faceImageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    croppedFaceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Device Information
            |--------------------------------------------------------------------------
            */

    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    cameraId: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      trim: true,
      default: "",
    },

    /*
            |--------------------------------------------------------------------------
            | Geo Tracking
            |--------------------------------------------------------------------------
            */

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
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
      maxlength: 500,
      trim: true,
      default: "",
    },

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
| Unique Constraint
|--------------------------------------------------------------------------
*/


/*
| Candidate Lookup
|--------------------------------------------------------------------------
*/







/*
|--------------------------------------------------------------------------
| Verification Dashboard
|--------------------------------------------------------------------------
*/

FaceVerificationSchema.index({
  examId: 1,
  verificationStatus: 1,
});

FaceVerificationSchema.index({
  examCenterId: 1,
  verificationStatus: 1,
});

FaceVerificationSchema.index({
  spoofDetection: 1,
  verificationStatus: 1,
});

/*
|--------------------------------------------------------------------------
| AI Matching
|--------------------------------------------------------------------------
*/

FaceVerificationSchema.index({
  confidenceScore: -1,
});

FaceVerificationSchema.index({
  faceDistance: 1,
});

/*
|--------------------------------------------------------------------------
| Device Monitoring
|--------------------------------------------------------------------------
*/

FaceVerificationSchema.index({
  deviceId: 1,
});

FaceVerificationSchema.index({
  cameraId: 1,
});

FaceVerificationSchema.index({
  ipAddress: 1,
});

/*
|--------------------------------------------------------------------------
| Geo Monitoring
|--------------------------------------------------------------------------
*/

FaceVerificationSchema.index({
  latitude: 1,
  longitude: 1,
});

/*
|--------------------------------------------------------------------------
| Retry Monitoring
|--------------------------------------------------------------------------
*/

FaceVerificationSchema.index({
  retryCount: -1,
});

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

FaceVerificationSchema.index({
  verifiedAt: -1,
});

FaceVerificationSchema.index({
  createdAt: -1,
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

const FaceVerification = model<IFaceVerification>(
  "FaceVerification",
  FaceVerificationSchema,
);

export default FaceVerification;
