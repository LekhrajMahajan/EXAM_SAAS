import { z } from 'zod';

export const paperBasicInfoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Paper Name is required and must be at least 3 characters'),
  code: z.string().min(2, 'Paper Code is required'),
  subject: z.string().min(1, 'Subject is required'),
  examType: z.string().min(1, 'Exam Type is required'),
  language: z.string().min(1, 'Language is required'),
  instructions: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  passingMarks: z.number().min(1, 'Passing marks must be at least 1'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  negativeMarking: z.boolean(),
  negativeMarks: z.number().optional(),
  status: z.enum(['Draft', 'Published', 'Archived']),
});

export const paperQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['MCQ', 'MSQ', 'True/False', 'Descriptive']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  marks: z.number(),
  topic: z.string().optional(),
});

export const paperBlueprintSchema = z.object({
  easyQuestions: z.number().min(0).default(0),
  mediumQuestions: z.number().min(0).default(0),
  hardQuestions: z.number().min(0).default(0),
  mcqCount: z.number().min(0).default(0),
  msqCount: z.number().min(0).default(0),
  tfCount: z.number().min(0).default(0),
  descriptiveCount: z.number().min(0).default(0),
});

export const paperSchema = paperBasicInfoSchema.extend({
  questions: z.array(paperQuestionSchema).default([]),
  blueprint: paperBlueprintSchema.optional(),
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
