import { z } from "zod";

import { PaperQuestionStatus } from "./paperQuestion.types";

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
| Create Paper Question
|--------------------------------------------------------------------------
*/

export const createPaperQuestionSchema = z.object({
  body: z.object({
    paperId: objectId,

    questionId: objectId,

    sectionCode: z
      .string()
      .trim()
      .min(1)
      .max(10)
      .transform((value) => value.toUpperCase()),

    questionOrder: z.number().int().min(1),

    displayOrder: z.number().int().min(1),

    marks: z.number().positive(),

    negativeMarks: z.number().min(0),

    isCompulsory: z.boolean(),

    status: z.nativeEnum(PaperQuestionStatus).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Bulk Create
|--------------------------------------------------------------------------
*/

export const bulkCreatePaperQuestionSchema = z.object({
  body: z.object({
    paperId: objectId,

    questions: z
      .array(
        z.object({
          questionId: objectId,

          sectionCode: z
            .string()
            .trim()
            .transform((value) => value.toUpperCase()),

          questionOrder: z.number().int().min(1),

          displayOrder: z.number().int().min(1),

          marks: z.number().positive(),

          negativeMarks: z.number().min(0),

          isCompulsory: z.boolean(),
        }),
      )
      .min(1),
  })
});

/*
|--------------------------------------------------------------------------
| Update Paper Question
|--------------------------------------------------------------------------
*/

export const updatePaperQuestionSchema = z.object({
  params: z.object({ id: objectId }),
  body: createPaperQuestionSchema.shape.body.partial().strict(),
});

/*
|--------------------------------------------------------------------------
| Reorder Questions
|--------------------------------------------------------------------------
*/

export const reorderPaperQuestionsSchema = z.object({
  body: z.object({
    paperId: objectId,

    questions: z
      .array(
        z.object({
          id: objectId,

          questionOrder: z.number().int().min(1),

          displayOrder: z.number().int().min(1),
        }),
      )
      .min(1),
  })
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updatePaperQuestionStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.nativeEnum(PaperQuestionStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const paperQuestionIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const paperQuestionQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    paperId: objectId.optional(),

    sectionCode: z.string().optional(),

    status: z.nativeEnum(PaperQuestionStatus).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Map Questions
|--------------------------------------------------------------------------
*/

export const mapPaperQuestionsSchema = z.object({
  body: z.object({
    paperId: objectId,
    subjectId: objectId.optional(),
    questionIds: z.union([objectId, z.array(objectId)]),
    marksPerQuestion: z.number().optional(),
    negativeMarks: z.number().optional(),
    sectionName: z.string().optional(),
    displayOrderStart: z.number().optional(),
    shuffleQuestions: z.boolean().optional(),
  }),
});
