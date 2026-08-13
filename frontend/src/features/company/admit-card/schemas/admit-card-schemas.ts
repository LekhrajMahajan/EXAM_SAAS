import { z } from 'zod';

export const admitCardGenerationSchema = z.object({
  examId: z.string().min(1, 'Exam is required'),
  shiftId: z.string().min(1, 'Shift is required'),
  scope: z.enum(['all', 'selected', 'single']),
  candidateIds: z.array(z.string()).optional(),
  singleCandidateId: z.string().optional(),
});
