import { z } from "zod";

import { ShiftStatus } from "./shift.types";

/*
|--------------------------------------------------------------------------
| ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/*
|--------------------------------------------------------------------------
| Create Shift
|--------------------------------------------------------------------------
*/

const baseShiftSchema = z.object({
  companyId: objectId,

  branchId: objectId,

  centerId: objectId,

  shiftName: z.string().trim().min(3).max(100),

  shiftCode: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase()),

  startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),

  endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),

  reportingTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),

  gateClosingTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),

  description: z.string().trim().max(500).optional(),

  status: z.nativeEnum(ShiftStatus).optional(),
});

export const createShiftSchema = z.object({
  body: baseShiftSchema.superRefine((data, ctx) => {
    if (data.reportingTime >= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reportingTime"],
        message: "Reporting time must be before shift start time.",
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
        message: "Gate closing time must be before shift start time.",
      });
    }

    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  })
});

/*
|--------------------------------------------------------------------------
| Update Shift
|--------------------------------------------------------------------------
*/

export const updateShiftSchema = z.object({
  params: z.object({ id: objectId }),
  body: baseShiftSchema.partial().strict()
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateShiftStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.nativeEnum(ShiftStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const shiftIdSchema = z.object({
  params: z.object({ id: objectId })
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const shiftQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    centerId: objectId.optional(),

    branchId: objectId.optional(),

    companyId: objectId.optional(),

    status: z.nativeEnum(ShiftStatus).optional(),
  })
});
