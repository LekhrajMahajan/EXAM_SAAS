import { z } from "zod";

import { ExamCenterStatus } from "./examCenter.types";

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
| Create Exam Center
|--------------------------------------------------------------------------
*/

const baseExamCenterSchema = z.object({
  examId: objectId,

  shiftId: objectId,

  centerId: objectId,

  centerCapacity: z.number().int().min(1),

  allocatedCandidates: z.number().int().min(0).default(0),

  availableSeats: z.number().int().min(0),

  reportingTime: z.coerce.date(),

  gateClosingTime: z.coerce.date(),

  startTime: z.coerce.date(),

  endTime: z.coerce.date(),

  status: z.nativeEnum(ExamCenterStatus).optional(),
});

export const createExamCenterSchema = z.object({
  body: baseExamCenterSchema.superRefine(
    (data, ctx) => {
    /*
    |--------------------------------------------------------------------------
    | Capacity
    |--------------------------------------------------------------------------
    */

    if (data.availableSeats > data.centerCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["availableSeats"],
        message: "Available seats cannot exceed center capacity.",
      });
    }

    if (data.allocatedCandidates > data.centerCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allocatedCandidates"],
        message: "Allocated candidates cannot exceed center capacity.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Time Validation
    |--------------------------------------------------------------------------
    */

    if (data.reportingTime >= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reportingTime"],
        message: "Reporting time must be before exam start.",
      });
    }

    if (data.gateClosingTime < data.reportingTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gateClosingTime"],
        message: "Gate closing time must be after reporting time.",
      });
    }

    if (data.gateClosingTime > data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gateClosingTime"],
        message: "Gate closing time must be before exam start.",
      });
    }

    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  }),
});

/*
|--------------------------------------------------------------------------
| Update Exam Center
|--------------------------------------------------------------------------
*/

export const updateExamCenterSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: baseExamCenterSchema.partial().strict(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateExamCenterStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(ExamCenterStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const examCenterIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const examCenterQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    examId: objectId.optional(),

    shiftId: objectId.optional(),

    centerId: objectId.optional(),

    status: z.nativeEnum(ExamCenterStatus).optional(),
  }),
});

export const mapExamCentersSchema = z.object({
  body: z.object({
    examId: objectId,
    shiftId: objectId,
    centerIds: z.array(objectId).min(1),
    allocationType: z.string().optional(),
    allowCandidateOverflow: z.boolean().optional(),
    status: z.string().optional(),
  }),
});
