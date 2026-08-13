import { z } from "zod";

import { QrErrorCorrection, QrImageFormat, QrType } from "./qr.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Generate QR
|--------------------------------------------------------------------------
*/

export const generateQrSchema = z.object({
  body: z.object({
    type: z.nativeEnum(QrType),

    text: z.string().min(1),

    fileName: z.string().min(1).max(255),

    width: z.number().min(100).max(2000).optional(),

    margin: z.number().min(0).max(20).optional(),

    imageFormat: z.nativeEnum(QrImageFormat).optional(),

    errorCorrectionLevel: z.nativeEnum(QrErrorCorrection).optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Certificate QR
|--------------------------------------------------------------------------
*/

export const certificateQrSchema = z.object({
  body: z.object({
    certificateId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Admit Card QR
|--------------------------------------------------------------------------
*/

export const admitCardQrSchema = z.object({
  body: z.object({
    admitCardId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Result QR
|--------------------------------------------------------------------------
*/

export const resultQrSchema = z.object({
  body: z.object({
    resultId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Employee QR
|--------------------------------------------------------------------------
*/

export const employeeQrSchema = z.object({
  body: z.object({
    employeeId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Candidate QR
|--------------------------------------------------------------------------
*/

export const candidateQrSchema = z.object({
  body: z.object({
    candidateId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Paper QR
|--------------------------------------------------------------------------
*/

export const paperQrSchema = z.object({
  body: z.object({
    paperId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Exam QR
|--------------------------------------------------------------------------
*/

export const examQrSchema = z.object({
  body: z.object({
    examId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Verify QR
|--------------------------------------------------------------------------
*/

export const verifyQrSchema = z.object({
  body: z.object({
    text: z.string().min(1),
  }),
});
