import { z } from "zod";
import { Types } from "mongoose";

import { AttendanceStatus, VerificationStatus } from "./attendance.types";

/* -------------------------------------------------------------------------- */
/*                               ObjectId Schema                              */
/* -------------------------------------------------------------------------- */

const objectId = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: "Invalid ObjectId",
});

/* -------------------------------------------------------------------------- */
/*                            Create Attendance                               */
/* -------------------------------------------------------------------------- */

export const createAttendanceSchema = z.object({
  body: z.object({
    candidateAssignmentId: objectId,

    admitCardId: objectId,

    candidateId: objectId,

    examId: objectId,

    shiftId: objectId,

    examCenterId: objectId,

    examRoomId: objectId,

    seatAllocationId: objectId,

    attendanceStatus: z.nativeEnum(AttendanceStatus).optional(),

    remarks: z.string().trim().max(500).optional(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                QR Check In                                 */
/* -------------------------------------------------------------------------- */

export const qrCheckInSchema = z.object({
  body: z.object({
    admitCardNumber: z.string().trim().min(1),

    deviceId: z.string().trim().min(1),

    scannerId: z.string().trim().min(1),

    latitude: z.number(),

    longitude: z.number(),

    ipAddress: z.string().trim(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                              Manual Attendance                             */
/* -------------------------------------------------------------------------- */

export const manualAttendanceSchema = z.object({
  body: z.object({
    candidateAssignmentId: objectId,

    attendanceStatus: z.nativeEnum(AttendanceStatus),

    remarks: z.string().trim().max(500).optional(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                 Check Out                                  */
/* -------------------------------------------------------------------------- */

export const checkOutSchema = z.object({
  body: z.object({
    attendanceId: objectId,

    remarks: z.string().trim().max(500).optional(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                          Verification Update                               */
/* -------------------------------------------------------------------------- */

export const verificationSchema = z.object({
  body: z.object({
    attendanceId: objectId,

    qrVerification: z.nativeEnum(VerificationStatus).optional(),

    biometricVerification: z.nativeEnum(VerificationStatus).optional(),

    faceVerification: z.nativeEnum(VerificationStatus).optional(),

    manualVerification: z.nativeEnum(VerificationStatus).optional(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                             Update Attendance                              */
/* -------------------------------------------------------------------------- */

export const updateAttendanceSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    attendanceStatus: z.nativeEnum(AttendanceStatus).optional(),

    remarks: z.string().trim().max(500).optional(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                           Update Attendance Status                         */
/* -------------------------------------------------------------------------- */

export const updateAttendanceStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    attendanceStatus: z.nativeEnum(AttendanceStatus),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                 Get By Id                                  */
/* -------------------------------------------------------------------------- */

export const attendanceIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/* -------------------------------------------------------------------------- */
/*                              Attendance List                               */
/* -------------------------------------------------------------------------- */

export const attendanceQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    search: z.string().optional(),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    shiftId: objectId.optional(),

    examCenterId: objectId.optional(),

    examRoomId: objectId.optional(),

    attendanceStatus: z.nativeEnum(AttendanceStatus).optional(),

    qrVerification: z.nativeEnum(VerificationStatus).optional(),

    biometricVerification: z.nativeEnum(VerificationStatus).optional(),

    faceVerification: z.nativeEnum(VerificationStatus).optional(),

    manualVerification: z.nativeEnum(VerificationStatus).optional(),

    sortBy: z
      .enum(["createdAt", "updatedAt", "checkInTime", "checkOutTime"])
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

/* -------------------------------------------------------------------------- */
/*                               Statistics                                   */
/* -------------------------------------------------------------------------- */

export const attendanceStatisticsSchema = z.object({
  query: z.object({
    examId: objectId.optional(),

    examCenterId: objectId.optional(),

    examRoomId: objectId.optional(),

    shiftId: objectId.optional(),
  }),
});
