import { z } from "zod";

import {
  ApprovalStatus,
  DifficultyLevel,
  QuestionLanguage,
  QuestionStatus,
  QuestionType,
} from "./question.types";

/*
|--------------------------------------------------------------------------
| ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Option
|--------------------------------------------------------------------------
*/

const optionSchema = z.object({
  optionId: z.string().trim().min(1),

  optionLabel: z.string().trim().min(1),

  optionText: z.string().trim().min(1),

  image: z.string().optional(),

  isCorrect: z.boolean(),
});

/*
|--------------------------------------------------------------------------
| Attachment
|--------------------------------------------------------------------------
*/

const attachmentSchema = z.object({
  type: z.enum(["IMAGE", "AUDIO", "VIDEO", "PDF"]),

  url: z.string().url(),
});

/*
|--------------------------------------------------------------------------
| Create Question
|--------------------------------------------------------------------------
*/

const baseQuestionSchema = z.object({
  companyId: objectId,

  subjectId: objectId,

  chapterId: objectId,

  topicId: objectId,

  questionCode: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((v) => v.toUpperCase()),

  language: z.nativeEnum(QuestionLanguage),

  questionType: z.nativeEnum(QuestionType),

  difficulty: z.nativeEnum(DifficultyLevel),

  question: z.string().trim().min(5),

  options: z.array(optionSchema).default([]),

  correctAnswer: z.array(z.string()).default([]),

  marks: z.number().positive(),

  negativeMarks: z.number().min(0),

  explanation: z.string().optional(),

  attachments: z.array(attachmentSchema).default([]),

  tags: z.array(z.string()).default([]),

  approvalStatus: z.nativeEnum(ApprovalStatus).optional(),

  status: z.nativeEnum(QuestionStatus).optional(),
});

const questionRefinements = (data: any, ctx: z.RefinementCtx) => {
  /*
  |--------------------------------------------------------------------------
  | Single Choice
  |--------------------------------------------------------------------------
  */

  if (data.questionType === QuestionType.SINGLE_CHOICE) {
    if (data.options && data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Minimum 2 options required.",
      });
    }

    const correct = data.options ? data.options.filter((o: any) => o.isCorrect) : [];

    if (data.options && correct.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Exactly one correct option required.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Multiple Choice
  |--------------------------------------------------------------------------
  */

  if (data.questionType === QuestionType.MULTIPLE_CHOICE) {
    const correct = data.options ? data.options.filter((o: any) => o.isCorrect) : [];

    if (data.options && correct.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Minimum two correct options required.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | True False
  |--------------------------------------------------------------------------
  */

  if (data.questionType === QuestionType.TRUE_FALSE) {
    if (data.options && data.options.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "True/False requires exactly 2 options.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Numerical
  |--------------------------------------------------------------------------
  */

  if (data.questionType === QuestionType.NUMERICAL) {
    if (data.correctAnswer && data.correctAnswer.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "Numerical question requires one answer.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Subjective
  |--------------------------------------------------------------------------
  */

  if (data.questionType === QuestionType.SUBJECTIVE) {
    if (data.options && data.options.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Subjective questions cannot have options.",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Negative Marks
  |--------------------------------------------------------------------------
  */

  if (data.negativeMarks !== undefined && data.marks !== undefined && data.negativeMarks > data.marks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["negativeMarks"],
      message: "Negative marks cannot exceed total marks.",
    });
  }
};

const questionPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    
    if (data.questionType === "MCQ") {
      data.questionType = (data.correctAnswer && data.correctAnswer.length > 1) 
        ? "MULTIPLE_CHOICE" 
        : "SINGLE_CHOICE";
    }

    if (data.difficultyLevel && !data.difficulty) {
      data.difficulty = data.difficultyLevel;
    }

    if (data.questionText && !data.question) {
      data.question = data.questionText;
    }
    
    if (!data.language) {
      data.language = "ENGLISH";
    }
    
    if (!data.questionCode) {
      data.questionCode = `Q-${Date.now()}`;
    }

    if (Array.isArray(data.options)) {
      data.options = data.options.map((opt: any) => {
        const option = { ...opt };
        if (!option.optionLabel && option.optionId) {
          option.optionLabel = option.optionId;
        }
        return option;
      });
    }

    return data;
  }
  return val;
};

const refinedBaseSchema = baseQuestionSchema.superRefine(questionRefinements);

export const createQuestionSchema = z.object({
  body: z.preprocess(questionPreprocess, refinedBaseSchema)
});

/*
|--------------------------------------------------------------------------
| Update Question
|--------------------------------------------------------------------------
*/

export const updateQuestionSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.preprocess(questionPreprocess, baseQuestionSchema.partial().superRefine(questionRefinements))
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateQuestionStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.nativeEnum(QuestionStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Approval
|--------------------------------------------------------------------------
*/

export const updateApprovalSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(ApprovalStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Duplicate Question
|--------------------------------------------------------------------------
*/

export const duplicateQuestionSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    copyOptions: z.boolean().default(true),
    copyExplanation: z.boolean().default(true),
    copyTags: z.boolean().default(true),
    status: z.nativeEnum(QuestionStatus).optional(),
    approvalStatus: z.nativeEnum(ApprovalStatus).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const questionIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const questionQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(10),

    search: z.string().optional(),

    companyId: objectId.optional(),

    subjectId: objectId.optional(),

    chapterId: objectId.optional(),

    topicId: objectId.optional(),

    difficulty: z.nativeEnum(DifficultyLevel).optional(),

    questionType: z.nativeEnum(QuestionType).optional(),

    approvalStatus: z.nativeEnum(ApprovalStatus).optional(),

    status: z.nativeEnum(QuestionStatus).optional(),
  }),
});
