import { z } from "zod";
import {
  BiometricType,
  BiometricVerificationStatus,
  LivenessStatus,
} from "./biometricVerification.types";

/*
|--------------------------------------------------------------------------
| ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

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
| Latitude & Longitude
|--------------------------------------------------------------------------
*/

const latitude = z.number().min(-90).max(90);

const longitude = z.number().min(-180).max(180);

/*
|--------------------------------------------------------------------------
| Create Verification
|--------------------------------------------------------------------------
*/

export const createBiometricVerificationSchema = z.object({
  attendanceId: objectId,

  admitCardId: objectId,

  candidateAssignmentId: objectId,

  candidateId: objectId,

  examId: objectId,

  examCenterId: objectId,

  biometricType: z.nativeEnum(BiometricType),

  deviceId: z.string().trim().min(3).max(100),

  scannerId: z.string().trim().min(3).max(100),

  latitude,

  longitude,

  ipAddress: ipv4,
});

/*
|--------------------------------------------------------------------------
| Verify Candidate
|--------------------------------------------------------------------------
*/

export const verifyCandidateSchema = z.object({
  verificationId: objectId,

  fingerprintScore: z.number().min(0).max(100).optional(),

  irisScore: z.number().min(0).max(100).optional(),

  faceScore: z.number().min(0).max(100).optional(),

  overallScore: z.number().min(0).max(100),

  livenessStatus: z.nativeEnum(LivenessStatus),
});

/*
|--------------------------------------------------------------------------
| Retry Verification
|--------------------------------------------------------------------------
*/

export const retryVerificationSchema = z.object({
  verificationId: objectId,

  remarks: z.string().trim().max(500).optional(),
});

/*
|--------------------------------------------------------------------------
| Update Verification
|--------------------------------------------------------------------------
*/

export const updateBiometricVerificationSchema = z.object({
  fingerprintScore: z.number().min(0).max(100).optional(),

  irisScore: z.number().min(0).max(100).optional(),

  faceScore: z.number().min(0).max(100).optional(),

  overallScore: z.number().min(0).max(100).optional(),

  remarks: z.string().trim().max(500).optional(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateVerificationStatusSchema = z.object({
  status: z.nativeEnum(BiometricVerificationStatus),
});

/*
|--------------------------------------------------------------------------
| Route Params
|--------------------------------------------------------------------------
*/

export const biometricVerificationIdSchema = z.object({
  id: objectId,
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const biometricVerificationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),

  search: z.string().optional(),

  examId: objectId.optional(),

  candidateId: objectId.optional(),

  examCenterId: objectId.optional(),

  biometricType: z.nativeEnum(BiometricType).optional(),

  verificationStatus: z.nativeEnum(BiometricVerificationStatus).optional(),

  livenessStatus: z.nativeEnum(LivenessStatus).optional(),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const biometricStatisticsSchema = z.object({
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

  scannerId: z.string().trim().min(3).max(100),
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

export const verifyBiometricMockSchema = z.object({
  body: z.object({
    examId: z.string().optional(),
    shiftId: z.string().optional(),
    candidateId: z.string().optional(),
    verificationMethod: z.string().optional(),
    deviceId: z.string().optional(),
    deviceSerialNumber: z.string().optional(),
    capturedTemplate: z.string().optional(),
    captureQuality: z.number().optional(),
    ipAddress: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
});
