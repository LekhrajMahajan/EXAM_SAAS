import { z } from 'zod';

export const generateMeritSchema = z.object({
  exam: z.string().min(1, 'Please select an exam'),
  subject: z.string().optional(),
  category: z.string().optional(),
  meritType: z.enum(['Overall', 'Category-wise', 'State-wise']),
  tieBreakingRules: z.array(z.string()).min(1, 'Select at least one tie-breaking rule'),
});

export type GenerateMeritForm = z.infer<typeof generateMeritSchema>;

export const publishMeritSchema = z.object({
  exam: z.string().min(1, 'Please select an exam'),
  meritType: z.string().min(1, 'Please select a merit type'),
  publishMethod: z.enum(['Immediate', 'Scheduled']),
  scheduledDate: z.string().optional(),
  notifyCandidates: z.boolean().optional(),
});

export type PublishMeritForm = z.infer<typeof publishMeritSchema>;
