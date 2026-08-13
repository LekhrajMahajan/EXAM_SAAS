import { z } from "zod";
import {
  FaceVerificationStatus,
  FaceLivenessStatus,
  FaceSource,
  SpoofDetectionStatus,
} from "./faceVerification.types";

/*
|--------------------------------------------------------------------------
| ObjectId Validation
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| IPv4
|--------------------------------------------------------------------------
*/

const ipv4 = z
  .string()
  .regex(
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
    "Invalid IP Address",
  );

/*
|--------------------------------------------------------------------------
| Geo Coordinates
|--------------------------------------------------------------------------
*/

const latitude = z.number().min(-90).max(90);

const longitude = z.number().min(-180).max(180);

/*
|--------------------------------------------------------------------------
| Create Face Verification
|--------------------------------------------------------------------------
*/

export const createFaceVerificationSchema = z.object({
  attendanceId: objectId,

  biometricVerificationId: objectId,

  admitCardId: objectId,

  candidateAssignmentId: objectId,

  candidateId: objectId,

  examId: objectId,

  examCenterId: objectId,

  faceSource: z.nativeEnum(FaceSource),

  faceImageUrl: z.string().url(),

  croppedFaceUrl: z.string().url().optional(),

  deviceId: z.string().trim().min(3).max(100),

  cameraId: z.string().trim().min(3).max(100),

  ipAddress: ipv4,

  latitude,

  longitude,
});

/*
|--------------------------------------------------------------------------
| Face Match
|--------------------------------------------------------------------------
*/

export const verifyFaceSchema = z.object({
  verificationId: objectId,

  confidenceScore: z.number().min(0).max(100),

  faceDistance: z.number().min(0),

  capturedEmbedding: z.array(z.number()).min(128).max(1024),
});

/*
|--------------------------------------------------------------------------
| Liveness Detection
|--------------------------------------------------------------------------
*/

export const livenessSchema = z.object({
  verificationId: objectId,

  livenessStatus: z.nativeEnum(FaceLivenessStatus),
});

/*
|--------------------------------------------------------------------------
| Spoof Detection
|--------------------------------------------------------------------------
*/

export const spoofDetectionSchema = z.object({
  verificationId: objectId,

  spoofDetection: z.nativeEnum(SpoofDetectionStatus),
});

/*
|--------------------------------------------------------------------------
| Retry Verification
|--------------------------------------------------------------------------
*/

export const retryFaceVerificationSchema = z.object({
  verificationId: objectId,

  remarks: z.string().trim().max(500).optional(),
});

/*
|--------------------------------------------------------------------------
| Update Face Verification
|--------------------------------------------------------------------------
*/

export const updateFaceVerificationSchema = z.object({
  confidenceScore: z.number().min(0).max(100).optional(),

  faceDistance: z.number().min(0).optional(),

  verificationStatus: z.nativeEnum(FaceVerificationStatus).optional(),

  remarks: z.string().trim().max(500).optional(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateFaceVerificationStatusSchema = z.object({
  status: z.nativeEnum(FaceVerificationStatus),
});

/*
|--------------------------------------------------------------------------
| Route Params
|--------------------------------------------------------------------------
*/

export const faceVerificationIdSchema = z.object({
  id: objectId,
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const faceVerificationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),

  search: z.string().optional(),

  examId: objectId.optional(),

  candidateId: objectId.optional(),

  examCenterId: objectId.optional(),

  verificationStatus: z.nativeEnum(FaceVerificationStatus).optional(),

  livenessStatus: z.nativeEnum(FaceLivenessStatus).optional(),

  spoofDetection: z.nativeEnum(SpoofDetectionStatus).optional(),

  faceSource: z.nativeEnum(FaceSource).optional(),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const faceStatisticsSchema = z.object({
  examId: objectId.optional(),

  examCenterId: objectId.optional(),
});

/*
|--------------------------------------------------------------------------
| Device Validation
|--------------------------------------------------------------------------
*/

export const deviceValidationSchema = z.object({
  deviceId: z.string().trim().min(3).max(100),

  cameraId: z.string().trim().min(3).max(100),
});

/*
|--------------------------------------------------------------------------
| Geo Validation
|--------------------------------------------------------------------------
*/

export const geoValidationSchema = z.object({
  latitude,

  longitude,
});

export const verifyFaceMockSchema = z.object({
  body: z.object({
    examId: objectId.optional(),
    shiftId: objectId.optional(),
    candidateId: objectId.optional(),
    verificationType: z.string().optional(),
    capturedImageUrl: z.string().optional(),
    deviceId: z.string().optional(),
    ipAddress: ipv4.optional(),
    latitude: latitude.optional(),
    longitude: longitude.optional(),
  })
});
