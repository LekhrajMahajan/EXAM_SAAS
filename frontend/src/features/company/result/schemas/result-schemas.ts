import { z } from 'zod';

export const generateResultSchema = z.object({
  exam: z.string().min(1, 'Please select an exam'),
});

export type GenerateResultForm = z.infer<typeof generateResultSchema>;

export const publishResultSchema = z.object({
  exam: z.string().min(1, 'Please select an exam'),
  publishMethod: z.enum(['Immediate', 'Scheduled']),
  scheduledDate: z.string().optional(),
  notifyCandidates: z.boolean().optional(),
});

export type PublishResultForm = z.infer<typeof publishResultSchema>;
