import type { z } from 'zod';
import type {
  reviewChecklistSchema,
  reviewDecisionSchema,
  paperReviewSchema,
  reviewHistoryItemSchema,
} from '../schemas/paper-review-schemas';

export type ReviewChecklist = z.infer<typeof reviewChecklistSchema>;
export type ReviewDecision = z.infer<typeof reviewDecisionSchema>;
export type PaperReview = z.infer<typeof paperReviewSchema>;
export type ReviewHistoryItem = z.infer<typeof reviewHistoryItemSchema>;

export interface ReviewQuestion {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  marks: number;
  topic: string;
}
