import { z } from 'zod';

export const manualReviewSchema = z.object({
  remarks: z.string().min(5, 'Remarks must be at least 5 characters long explaining the reason for manual review.'),
});

export type ManualReviewForm = z.infer<typeof manualReviewSchema>;
