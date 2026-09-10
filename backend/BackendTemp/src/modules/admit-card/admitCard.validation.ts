import { z } from "zod";
import { AdmitCardStatus } from "./admitCard.types";

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
| URL
|--------------------------------------------------------------------------
*/

const url = z.string().trim().url();

/*
|--------------------------------------------------------------------------
| Create Admit Card
|--------------------------------------------------------------------------
*/

export const createAdmitCardSchema = z.object({
  candidateAssignmentId: objectId,

  candidateId: objectId,

  examId: objectId,

  shiftId: objectId,

  examCenterId: objectId,

  examRoomId: objectId,

  seatAllocationId: objectId,

  qrCode: url,

  barcode: url,

  pdfUrl: url,

  remarks: z.string().trim().max(500).optional(),
});

/*
|--------------------------------------------------------------------------
| Bulk Generate
|--------------------------------------------------------------------------
*/

export const bulkGenerateAdmitCardsSchema = z.object({
  examId: objectId,

  candidateAssignmentIds: z.array(objectId).min(1).max(1000),
});

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

export const downloadAdmitCardSchema = z.object({
  id: objectId,
});

/*
|--------------------------------------------------------------------------
| Print
|--------------------------------------------------------------------------
*/

export const printAdmitCardSchema = z.object({
  id: objectId,
});

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

export const verifyAdmitCardSchema = z.object({
  admitCardNumber: z.string().trim().min(5),
});

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateAdmitCardSchema = z.object({
  qrCode: url.optional(),

  barcode: url.optional(),

  pdfUrl: url.optional(),

  remarks: z.string().trim().max(500).optional(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateAdmitCardStatusSchema = z.object({
  status: z.nativeEnum(AdmitCardStatus),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const admitCardIdSchema = z.object({
  id: objectId,
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const admitCardQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  examId: objectId.optional(),

  candidateId: objectId.optional(),

  shiftId: objectId.optional(),

  examCenterId: objectId.optional(),

  examRoomId: objectId.optional(),

  status: z.nativeEnum(AdmitCardStatus).optional(),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const admitCardStatisticsSchema = z.object({
  examId: objectId.optional(),

  examCenterId: objectId.optional(),

  shiftId: objectId.optional(),
});
