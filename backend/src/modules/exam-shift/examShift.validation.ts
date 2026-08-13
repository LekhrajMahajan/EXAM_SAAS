import { z } from "zod";

import { ExamShiftStatus } from "./examShift.types";

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
| Create Shift
|--------------------------------------------------------------------------
*/

const baseExamShiftSchema = z
  .object({
    examId: objectId,

    shiftCode: z
      .string()
      .trim()
      .min(2)
      .max(30)
      .transform((value) => value.toUpperCase()),

    shiftName: z.string().trim().min(3).max(100),

    shiftNumber: z.number().int().min(1),

    reportingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, expected HH:mm"),

    gateClosingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, expected HH:mm"),

    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, expected HH:mm"),

    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, expected HH:mm"),

    duration: z.number().int().min(1),

    totalCandidates: z.number().min(0).optional(),

    totalCenters: z.number().min(0).optional(),

    totalRooms: z.number().min(0).optional(),

    totalSeats: z.number().min(0).optional(),

    status: z.nativeEnum(ExamShiftStatus).optional(),
  });

export const createExamShiftSchema = z.object({
  body: baseExamShiftSchema.superRefine((data, ctx) => {
    /*
    |--------------------------------------------------------------------------
    | Reporting Time
    |--------------------------------------------------------------------------
    */

    if (data.reportingTime >= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reportingTime"],
        message: "Reporting time must be before exam start time.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Gate Closing
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Start / End
    |--------------------------------------------------------------------------
    */

    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Duration
    |--------------------------------------------------------------------------
    */

    const startParts = data.startTime.split(":");
    const endParts = data.endTime.split(":");
    const startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    const duration = endMins - startMins;

    if (duration !== data.duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["duration"],
        message:
          "Duration must match the difference between start and end time.",
      });
    }
  }),
});

/*
|--------------------------------------------------------------------------
| Update Shift
|--------------------------------------------------------------------------
*/

export const updateExamShiftSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: baseExamShiftSchema.partial().strict(),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateExamShiftStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(ExamShiftStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const examShiftIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const examShiftQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    examId: objectId.optional(),

    status: z.nativeEnum(ExamShiftStatus).optional(),
  }),
});
