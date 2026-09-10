import { z } from "zod";

import { PaperApprovalStatus, PaperStatus } from "./paper.types";

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
| Section
|--------------------------------------------------------------------------
*/

const sectionSchema = z.object({
  sectionCode: z
    .string()
    .trim()
    .min(1)
    .max(10)
    .transform((value) => value.toUpperCase()),

  sectionName: z.string().trim().min(2).max(100),

  instructions: z.string().trim().optional(),

  totalQuestions: z.number().int().min(1),

  totalMarks: z.number().positive(),

  optionalQuestions: z.number().int().min(0).default(0),

  displayOrder: z.number().int().min(1),
});

/*
|--------------------------------------------------------------------------
| Create Paper
|--------------------------------------------------------------------------
*/

const paperBaseSchema = z
  .object({
    companyId: objectId,

    subjectId: objectId,

    paperCode: z
      .string()
      .trim()
      .min(2)
      .max(30)
      .transform((value) => value.toUpperCase()),

    paperName: z.string().trim().min(3).max(200),

    description: z.string().trim().max(1000).optional(),

    duration: z.number().int().min(1),

    totalQuestions: z.number().int().min(1),

    totalMarks: z.number().positive(),

    passingMarks: z.number().min(0),

    negativeMarking: z.boolean(),

    negativeMarks: z.number().min(0),

    shuffleQuestions: z.boolean(),

    shuffleOptions: z.boolean(),

    instructions: z.array(z.string()).default([]),

    sections: z.array(sectionSchema).min(1),

    approvalStatus: z.nativeEnum(PaperApprovalStatus).optional(),

    status: z.nativeEnum(PaperStatus).optional(),
  });

export const createPaperSchema = z.object({
  body: paperBaseSchema
    .superRefine((data, ctx) => {
    /*
    |--------------------------------------------------------------------------
    | Passing Marks
    |--------------------------------------------------------------------------
    */

    if (data.passingMarks > data.totalMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passingMarks"],
        message: "Passing marks cannot exceed total marks.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Negative Marks
    |--------------------------------------------------------------------------
    */

    if (!data.negativeMarking && data.negativeMarks > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["negativeMarks"],
        message: "Negative marks must be 0 when negative marking is disabled.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Section Validation
    |--------------------------------------------------------------------------
    */
    const totalQuestions = data.sections.reduce(
      (sum, section) => sum + section.totalQuestions,
      0,
    );

    if (totalQuestions !== data.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sections"],
        message: "Section questions must equal total questions.",
      });
    }

    const totalMarks = data.sections.reduce(
      (sum, section) => sum + section.totalMarks,
      0,
    );

    if (totalMarks !== data.totalMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sections"],
        message: "Section marks must equal total marks.",
      });
    }
  })
});

/*
|--------------------------------------------------------------------------
| Update Paper
|--------------------------------------------------------------------------
*/

export const updatePaperSchema = z.object({
  params: z.object({ id: objectId }),
  body: paperBaseSchema.partial().strict(),
});

/*
|--------------------------------------------------------------------------
| Clone Paper
|--------------------------------------------------------------------------
*/

export const clonePaperSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    paperName: z.string().trim().min(3).max(100),
    paperCode: z.string().trim().min(3).max(30).transform((val) => val.toUpperCase()),
    copyQuestions: z.boolean().default(true),
    copyInstructions: z.boolean().default(true),
    copySettings: z.boolean().default(true),
    approvalStatus: z.nativeEnum(PaperApprovalStatus).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updatePaperStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.nativeEnum(PaperStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Submit For Approval
|--------------------------------------------------------------------------
*/

export const submitPaperForApprovalSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(PaperApprovalStatus).optional(),
    submittedBy: objectId.optional(),
    remarks: z.string().trim().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Approve Paper
|--------------------------------------------------------------------------
*/

export const approvePaperSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(PaperApprovalStatus).optional(),
    approvedBy: objectId.optional(),
    approvalRemarks: z.string().trim().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Reject Paper
|--------------------------------------------------------------------------
*/

export const rejectPaperSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(PaperApprovalStatus).optional(),
    rejectedBy: objectId.optional(),
    rejectionReason: z.string().trim().optional(),
    rejectionRemarks: z.string().trim().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Approval
|--------------------------------------------------------------------------
*/

export const updatePaperApprovalSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(PaperApprovalStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const paperIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const paperQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    companyId: objectId.optional(),
    subjectId: objectId.optional(),
    approvalStatus: z.nativeEnum(PaperApprovalStatus).optional(),
    status: z.nativeEnum(PaperStatus).optional(),
  })
});
