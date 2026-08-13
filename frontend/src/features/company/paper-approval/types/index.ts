import type { z } from 'zod';
import type {
  approvalChecklistSchema,
  approvalDecisionSchema,
  paperApprovalSchema,
  approvalHistoryItemSchema,
} from '../schemas/paper-approval-schemas';

export type ApprovalChecklist = z.infer<typeof approvalChecklistSchema>;
export type ApprovalDecision = z.infer<typeof approvalDecisionSchema>;
export type PaperApproval = z.infer<typeof paperApprovalSchema>;
export type ApprovalHistoryItem = z.infer<typeof approvalHistoryItemSchema>;

export interface ApprovalQuestion {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  marks: number;
  topic: string;
}
