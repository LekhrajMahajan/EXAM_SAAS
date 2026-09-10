import { z } from "zod";

import { QuestionStatus } from "./candidateAnswer.types";

/*
|--------------------------------------------------------------------------
| Common Validators
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Save Answer
|--------------------------------------------------------------------------
*/

export const saveAnswerSchema = z.object({
  body: z.object({
    submissionId: objectId.optional(),

    candidateId: objectId,

    examId: objectId,

    paperId: objectId,

    questionId: objectId,

    sectionId: objectId.optional(),

    questionNumber: z.number().int().positive().optional(),

    questionType: z.string().min(1).optional(),

    selectedOption: z.string().optional(),

    selectedOptions: z.array(z.string()).optional(),

    numericalAnswer: z.number().optional(),

    subjectiveAnswer: z.string().optional(),

    uploadedFile: z.string().optional(),

    isAnswered: z.boolean().default(false),
    isVisited: z.boolean().default(false),

    isMarkedForReview: z.boolean().default(false),

    questionStatus: z.nativeEnum(QuestionStatus).optional(),
    status: z.string().optional(),

    timeSpent: z.number().min(0).optional(),
    timeTaken: z.number().min(0).optional(),
    
    deviceTime: z.string().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Answer
|--------------------------------------------------------------------------
*/

export const updateAnswerSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    selectedOption: z.string().optional(),

    selectedOptions: z.array(z.string()).optional(),

    numericalAnswer: z.number().optional(),

    subjectiveAnswer: z.string().optional(),

    uploadedFile: z.string().optional(),

    isAnswered: z.boolean().optional(),
    isVisited: z.boolean().optional(),

    isMarkedForReview: z.boolean().optional(),

    questionStatus: z.nativeEnum(QuestionStatus).optional(),
    status: z.string().optional(),

    timeSpent: z.number().min(0).optional(),
    timeTaken: z.number().min(0).optional(),

    deviceTime: z.string().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Mark For Review
|--------------------------------------------------------------------------
*/

export const markForReviewSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    isMarkedForReview: z.boolean(),
  }),
});

/*
|--------------------------------------------------------------------------
| Clear Answer
|--------------------------------------------------------------------------
*/

export const clearAnswerSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

export const candidateAnswerIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Get By Submission
|--------------------------------------------------------------------------
*/

export const submissionAnswersSchema = z.object({
  params: z.object({
    submissionId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const candidateAnswerQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(500).default(50),

    candidateId: objectId.optional(),

    examId: objectId.optional(),

    paperId: objectId.optional(),

    submissionId: objectId.optional(),

    questionStatus: z.nativeEnum(QuestionStatus).optional(),
  }),
});
