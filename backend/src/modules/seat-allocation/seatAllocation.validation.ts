import { z } from "zod";

import { SeatAllocationStatus } from "./seatAllocation.types";

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
| Create Seat Allocation
|--------------------------------------------------------------------------
*/

const baseSeatAllocationSchema = z
  .object({
    examId: objectId,

    shiftId: objectId,

    examCenterId: objectId,

    examRoomId: objectId,

    seatId: objectId,

    seatNumber: z.string().trim().min(1).max(50),

    rowNumber: z.number().int().min(1),

    columnNumber: z.number().int().min(1),

    candidateId: objectId.optional(),

    allocationStatus: z.nativeEnum(SeatAllocationStatus).optional(),

    remarks: z.string().trim().max(500).optional(),
  });

export const createSeatAllocationSchema = z.object({
  body: baseSeatAllocationSchema.superRefine((data, ctx) => {
    /*
        |--------------------------------------------------------------------------
        | Candidate Required For Occupied Seat
        |--------------------------------------------------------------------------
        */

    if (
      data.allocationStatus === SeatAllocationStatus.OCCUPIED &&
      !data.candidateId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["candidateId"],
        message: "Candidate is required when seat is occupied.",
      });
    }

    /*
        |--------------------------------------------------------------------------
        | Candidate Not Allowed For Available Seat
        |--------------------------------------------------------------------------
        */

    if (
      data.allocationStatus === SeatAllocationStatus.AVAILABLE &&
      data.candidateId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["candidateId"],
        message: "Available seat cannot have candidate assigned.",
      });
    }
  }),
});

/*
|--------------------------------------------------------------------------
| Update Seat Allocation
|--------------------------------------------------------------------------
*/

export const updateSeatAllocationSchema = z.object({
  params: z.object({ id: objectId }),
  body: baseSeatAllocationSchema.partial().strict(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateSeatAllocationStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    allocationStatus: z.nativeEnum(SeatAllocationStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const seatAllocationIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const seatAllocationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    examId: objectId.optional(),

    shiftId: objectId.optional(),

    examCenterId: objectId.optional(),

    examRoomId: objectId.optional(),

    seatId: objectId.optional(),

    candidateId: objectId.optional(),

    allocationStatus: z.nativeEnum(SeatAllocationStatus).optional(),

    search: z.string().trim().optional(),
  })
});

export const generateSeatAllocationSchema = z.object({
  body: z.object({
    examId: objectId,
    shiftId: objectId,
    centerId: objectId,
    allocationStrategy: z.string().optional(),
    allowReallocation: z.boolean().optional(),
    generateQrCode: z.boolean().optional(),
  }),
});
