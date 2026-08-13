import { z } from 'zod';

export const liveMonitoringFilterSchema = z.object({
  exam: z.string().optional(),
  center: z.string().optional(),
  branch: z.string().optional(),
  shift: z.string().optional(),
  status: z.string().optional(),
  searchQuery: z.string().optional(),
});

export type LiveMonitoringFilter = z.infer<typeof liveMonitoringFilterSchema>;
