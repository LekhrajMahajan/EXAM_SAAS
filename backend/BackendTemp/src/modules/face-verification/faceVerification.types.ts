import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Face Verification Status
|--------------------------------------------------------------------------
*/

export enum FaceVerificationStatus {
  PENDING = "PENDING",

  VERIFIED = "VERIFIED",

  FAILED = "FAILED",

  REJECTED = "REJECTED",

  BYPASSED = "BYPASSED",
}

/*
|--------------------------------------------------------------------------
| Liveness Status
|--------------------------------------------------------------------------
*/

export enum FaceLivenessStatus {
  PENDING = "PENDING",

  PASSED = "PASSED",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Face Source
|--------------------------------------------------------------------------
*/

export enum FaceSource {
  REGISTRATION = "REGISTRATION",

  ADMIT_CARD = "ADMIT_CARD",

  LIVE_CAMERA = "LIVE_CAMERA",

  PROCTORING = "PROCTORING",
}

/*
|--------------------------------------------------------------------------
| Spoof Detection
|--------------------------------------------------------------------------
*/

export enum SpoofDetectionStatus {
  UNKNOWN = "UNKNOWN",

  CLEAN = "CLEAN",

  SUSPECTED = "SUSPECTED",

  SPOOF = "SPOOF",
}

/*
|--------------------------------------------------------------------------
| Interface
|--------------------------------------------------------------------------
*/

export interface IFaceVerification {
  attendanceId: Types.ObjectId;

  biometricVerificationId: Types.ObjectId;

  admitCardId: Types.ObjectId;

  candidateAssignmentId: Types.ObjectId;

  candidateId: Types.ObjectId;

  examId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  faceSource: FaceSource;

  verificationStatus: FaceVerificationStatus;

  livenessStatus: FaceLivenessStatus;

  spoofDetection: SpoofDetectionStatus;

  confidenceScore: number;

  faceDistance: number;

  registeredEmbedding: number[];

  capturedEmbedding: number[];

  faceImageUrl: string;

  croppedFaceUrl?: string;

  deviceId: string;

  cameraId: string;

  ipAddress?: string;

  latitude?: number;

  longitude?: number;

  retryCount: number;

  maxRetryLimit: number;

  verifiedBy?: Types.ObjectId | null;

  verifiedAt?: Date | null;

  remarks?: string;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Document
|--------------------------------------------------------------------------
*/

export type FaceVerificationDocument = HydratedDocument<IFaceVerification>;
