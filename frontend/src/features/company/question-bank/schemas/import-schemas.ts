import { z } from 'zod';

export const QuestionRowSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(1, 'Question text is required'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
    message: 'Difficulty must be Easy, Medium, or Hard',
  }),
  marks: z.number().min(1, 'Marks must be greater than 0'),
  questionType: z.enum(['Multiple Choice', 'True/False', 'Subjective'], {
    message: 'Invalid question type',
  }),
  language: z.enum(['English', 'Hindi', 'Spanish', 'French'], {
    message: 'Invalid language',
  }),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  validationStatus: z.enum(['valid', 'invalid', 'duplicate']).optional().default('valid'),
  errors: z.array(z.string()).optional(),
});

export type QuestionRow = z.infer<typeof QuestionRowSchema>;

export const ImportConfigSchema = z.object({
  file: z.any().refine((file) => file !== null, 'File is required'),
  skipDuplicates: z.boolean().default(true),
  autoApprove: z.boolean().default(false),
});

export type ImportConfig = z.infer<typeof ImportConfigSchema>;
