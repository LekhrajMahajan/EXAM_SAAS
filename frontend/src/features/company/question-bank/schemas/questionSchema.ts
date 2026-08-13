import { z } from 'zod';

export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean().default(false),
  order: z.number().int(),
});

export const questionMetadataSchema = z.object({
  keywords: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  bloomsLevel: z.string().default(''),
  cognitiveLevel: z.string().default(''),
});

export const questionSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  chapter: z.string().min(1, 'Chapter is required'),
  questionType: z.enum([
    'Single Choice (MCQ)',
    'Multiple Choice (MSQ)',
    'True / False',
    'Fill in the Blank',
    'Numerical',
    'Descriptive',
  ], { invalid_type_error: 'Question type is required' }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], { invalid_type_error: 'Difficulty is required' }),
  language: z.string().min(1, 'Language is required'),
  questionText: z.string().min(5, 'Question text must be at least 5 characters'),
  options: z.array(optionSchema).default([]),
  explanation: z.string().default(''),
  marks: z.number().min(0, 'Marks cannot be negative'),
  negativeMarks: z.number().min(0, 'Negative marks cannot be negative (e.g. use 1 for -1)'),
  timeLimitSeconds: z.number().optional(),
  metadata: questionMetadataSchema,
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Rejected']).default('Draft'),
}).superRefine((data, ctx) => {
  // Validate options based on question type
  if (['Single Choice (MCQ)', 'Multiple Choice (MSQ)'].includes(data.questionType)) {
    if (data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least 2 options are required',
        path: ['options'],
      });
    }
    const correctOptions = data.options.filter(o => o.isCorrect);
    if (data.questionType === 'Single Choice (MCQ)' && correctOptions.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Exactly 1 option must be correct for MCQ',
        path: ['options'],
      });
    }
    if (data.questionType === 'Multiple Choice (MSQ)' && correctOptions.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least 1 option must be correct for MSQ',
        path: ['options'],
      });
    }
  }

  if (data.questionType === 'True / False') {
    if (data.options.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'True/False must have exactly 2 options',
        path: ['options'],
      });
    }
  }
});

export type QuestionFormData = z.infer<typeof questionSchema>;
export type QuestionOptionFormData = z.infer<typeof optionSchema>;
