import { z } from 'zod';

export const examSubmissionSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.number()])),
  confirmSubmission: z.boolean().refine(val => val === true, {
    message: 'You must confirm before submitting',
  }),
});

export type ExamSubmissionForm = z.infer<typeof examSubmissionSchema>;
