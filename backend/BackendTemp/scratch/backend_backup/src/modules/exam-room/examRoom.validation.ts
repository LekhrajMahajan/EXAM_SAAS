import { z } from "zod";

import { ExamRoomStatus } from "./examRoom.types";

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
| Create Exam Room
|--------------------------------------------------------------------------
*/

const baseExamRoomSchema = z
  .object({
    examId: objectId,

    shiftId: objectId,

    centerId: objectId,

    roomId: objectId,

    roomNumber: z.string().trim().min(1).max(50),

    floorNumber: z.number().int().min(0).optional(),

    buildingName: z.string().trim().max(100).optional(),

    roomCapacity: z.number().int().min(1),

    allocatedCandidates: z.number().int().min(0).default(0),

    availableSeats: z.number().int().min(0),

    status: z.nativeEnum(ExamRoomStatus).optional(),
  });

export const createExamRoomSchema = z.object({
  body: baseExamRoomSchema.superRefine((data, ctx) => {
    /*
    |--------------------------------------------------------------------------
    | Capacity Validation
    |--------------------------------------------------------------------------
    */

    if (data.availableSeats > data.roomCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["availableSeats"],
        message: "Available seats cannot exceed room capacity.",
      });
    }

    if (data.allocatedCandidates > data.roomCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allocatedCandidates"],
        message: "Allocated candidates cannot exceed room capacity.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Capacity Consistency
    |--------------------------------------------------------------------------
    */

    if (data.availableSeats + data.allocatedCandidates > data.roomCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roomCapacity"],
        message: "Allocated + Available seats cannot exceed room capacity.",
      });
    }
  }),
});

/*
|--------------------------------------------------------------------------
| Update Exam Room
|--------------------------------------------------------------------------
*/

export const updateExamRoomSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: baseExamRoomSchema.partial().strict(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateExamRoomStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(ExamRoomStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const examRoomIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const examRoomQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    examId: objectId.optional(),

    shiftId: objectId.optional(),

    centerId: objectId.optional(),

    roomId: objectId.optional(),

    status: z.nativeEnum(ExamRoomStatus).optional(),
  }),
});
