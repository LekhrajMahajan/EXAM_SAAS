import { z } from 'zod';

export const subjectSchema = z.object({
  name: z.string().min(2, 'Subject Name must be at least 2 characters'),
  code: z.string().min(2, 'Subject Code must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  examType: z.string().min(2, 'Exam Type is required'),
  language: z.string().min(2, 'Language is required'),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute'),
  totalQuestions: z.number().min(1, 'Must have at least 1 question'),
  totalMarks: z.number().min(1, 'Total Marks must be at least 1'),
  passingMarks: z.number().min(1, 'Passing Marks must be at least 1'),
  negativeMarking: z.boolean(),
  negativeMarksPerQuestion: z.number().min(0),
  displayOrder: z.number().min(0, 'Display order must be 0 or greater'),
  category: z.enum(['Competitive', 'University', 'School', 'Recruitment', 'Certification']),
  status: z.enum(['Active', 'Inactive']),
}).superRefine((data, ctx) => {
  if (data.passingMarks > data.totalMarks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passing marks cannot exceed total marks',
      path: ['passingMarks'],
    });
  }
  if (data.negativeMarking && data.negativeMarksPerQuestion <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Negative marks per question must be greater than 0 if enabled',
      path: ['negativeMarksPerQuestion'],
    });
  }
});

export type SubjectFormData = z.infer<typeof subjectSchema>;
