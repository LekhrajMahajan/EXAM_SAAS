import { z } from 'zod';

export const approvalChecklistSchema = z.object({
  paperComplete: z.boolean(),
  questionCountVerified: z.boolean(),
  marksVerified: z.boolean(),
  blueprintVerified: z.boolean(),
  difficultyVerified: z.boolean(),
  instructionsVerified: z.boolean(),
  languageVerified: z.boolean(),
});

export const approvalDecisionSchema = z.object({
  decision: z.enum(['Approve', 'Reject', 'Return for Review', 'Request Changes']),
  remarks: z.string().optional(),
  signature: z.string().min(1, 'Digital signature is required for approval decisions.'),
  lockPaper: z.boolean(),
});

export const paperApprovalSchema = z.object({
  id: z.string(),
  paperId: z.string(),
  paperCode: z.string(),
  paperName: z.string(),
  subject: z.string(),
  version: z.string(),
  reviewStatus: z.enum(['Pending', 'In Progress', 'Completed', 'Returned']),
  approvalStatus: z.enum(['Pending', 'In Review', 'Approved', 'Rejected', 'Returned']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  approver: z.string().optional(),
  createdDate: z.string(),
});

export const approvalHistoryItemSchema = z.object({
  id: z.string(),
  paperId: z.string(),
  approverName: z.string(),
  action: z.enum(['Approved', 'Rejected', 'Returned for Review', 'Changes Requested', 'Approval Started', 'Locked']),
  remarks: z.string().optional(),
  timestamp: z.string(),
  version: z.string(),
});
