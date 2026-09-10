import { z } from "zod";
import { SubjectStatus } from "./subject.types";

/*
|--------------------------------------------------------------------------
| Mongo ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Subject
|--------------------------------------------------------------------------
*/

const baseSubjectSchema = z.object({
  companyId: objectId,

  subjectCode: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  subjectName: z.string().trim().min(2).max(150),

  subjectShortName: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  description: z.string().trim().max(1000).optional(),

  language: z.string().trim().optional(),

  icon: z.string().url().optional().or(z.literal("")),

  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid Hex Color")
    .optional(),

  duration: z.number().int().positive().max(600),

  totalMarks: z.number().positive(),

  passingMarks: z.number().nonnegative(),

  negativeMarking: z.boolean(),

  negativeMarks: z.number().min(0),

  questionCount: z.number().int().min(0),

  status: z.nativeEnum(SubjectStatus).optional(),
});

const subjectRefinements = (data: any, ctx: z.RefinementCtx) => {
  if (data.negativeMarking !== undefined && data.negativeMarks !== undefined) {
    if (!data.negativeMarking && data.negativeMarks > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["negativeMarks"],
        message: "negativeMarks must be 0 when negativeMarking is false.",
      });
    }
  }

  if (data.passingMarks !== undefined && data.totalMarks !== undefined) {
    if (data.passingMarks > data.totalMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passingMarks"],
        message: "Passing marks cannot exceed total marks.",
      });
    }
  }
};

const subjectPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };

    if (!data.subjectShortName && data.subjectCode) {
      data.subjectShortName = String(data.subjectCode).substring(0, 20);
    }

    if (data.questionCount === undefined) {
      data.questionCount = 0;
    }

    return data;
  }
  return val;
};

export const createSubjectSchema = z.object({
  body: z.preprocess(
    subjectPreprocess,
    baseSubjectSchema.superRefine(subjectRefinements),
  ),
});

/*
|--------------------------------------------------------------------------
| Update Subject
|--------------------------------------------------------------------------
*/

export const updateSubjectSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(
    subjectPreprocess,
    baseSubjectSchema.partial().superRefine(subjectRefinements),
  ),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateSubjectStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(SubjectStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const subjectIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const subjectQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    companyId: objectId.optional(),

    language: z.string().trim().optional(),

    status: z.nativeEnum(SubjectStatus).optional(),
  }),
});
