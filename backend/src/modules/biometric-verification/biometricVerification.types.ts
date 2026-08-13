import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Verification Status
|--------------------------------------------------------------------------
*/

export enum BiometricVerificationStatus {
  PENDING = "PENDING",

  VERIFIED = "VERIFIED",

  FAILED = "FAILED",

  REJECTED = "REJECTED",

  BYPASSED = "BYPASSED",
}

/*
|--------------------------------------------------------------------------
| Biometric Type
|--------------------------------------------------------------------------
*/

export enum BiometricType {
  FINGERPRINT = "FINGERPRINT",

  IRIS = "IRIS",

  FACE = "FACE",

  MULTI_FACTOR = "MULTI_FACTOR",
}

/*
|--------------------------------------------------------------------------
| Liveness Status
|--------------------------------------------------------------------------
*/

export enum LivenessStatus {
  PENDING = "PENDING",

  PASSED = "PASSED",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Interface
|--------------------------------------------------------------------------
*/

export interface IBiometricVerification {
  attendanceId: Types.ObjectId;

  admitCardId: Types.ObjectId;

  candidateAssignmentId: Types.ObjectId;

  candidateId: Types.ObjectId;

  examId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  biometricType: BiometricType;

  verificationStatus: BiometricVerificationStatus;

  livenessStatus: LivenessStatus;

  fingerprintScore?: number;

  irisScore?: number;

  faceScore?: number;

  overallScore?: number;

  retryCount: number;

  maxRetryLimit: number;

  deviceId: string;

  scannerId: string;

  latitude?: number;

  longitude?: number;

  ipAddress?: string;

  verifiedBy?: Types.ObjectId | null;

  verifiedAt?: Date | null;

  remarks?: string;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;

  // Migrated from legacy biometric module
  companyId?: Types.ObjectId;

  branchId?: Types.ObjectId;

  shiftId?: Types.ObjectId;

  trustScoreId?: Types.ObjectId;

  geoMonitoringId?: Types.ObjectId;

  enrolledFaceImage?: string;

  latestFaceImage?: string;

  totalAttempts?: number;

  failedAttempts?: number;

  lastVerifiedAt?: Date | null;

  history?: Array<{
    action: string;
    biometricType: BiometricType;
    status: BiometricVerificationStatus;
    confidence?: number;
    liveness?: LivenessStatus;
    imageUrl?: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    remarks?: string;
    verifiedAt?: Date;
  }>;
}

/*
|--------------------------------------------------------------------------
| Document
|--------------------------------------------------------------------------
*/

export type BiometricVerificationDocument =
  HydratedDocument<IBiometricVerification>;
