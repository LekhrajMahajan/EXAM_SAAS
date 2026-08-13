import { z } from 'zod';

export const reviewChecklistSchema = z.object({
  questionQuality: z.boolean(),
  grammar: z.boolean(),
  spelling: z.boolean(),
  correctAnswer: z.boolean(),
  duplicateQuestions: z.boolean(),
  difficultyBalance: z.boolean(),
  marksDistribution: z.boolean(),
  blueprintValidation: z.boolean(),
  languageReview: z.boolean(),
  formatting: z.boolean(),
});

export const reviewDecisionSchema = z.object({
  decision: z.enum(['Approve for Approval', 'Needs Changes', 'Reject']),
  comments: z.string().optional(),
  internalNotes: z.string().optional(),
});

export const paperReviewSchema = z.object({
  id: z.string(),
  paperId: z.string(),
  paperCode: z.string(),
  paperName: z.string(),
  subject: z.string(),
  reviewerId: z.string(),
  reviewerName: z.string(),
  totalQuestions: z.number(),
  totalMarks: z.number(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Returned']),
  priority: z.enum(['High', 'Medium', 'Low']),
  assignedDate: z.string(),
  dueDate: z.string().optional(),
  checklist: reviewChecklistSchema.optional(),
  decision: reviewDecisionSchema.optional(),
});

export const reviewHistoryItemSchema = z.object({
  id: z.string(),
  paperId: z.string(),
  reviewerName: z.string(),
  action: z.string(),
  date: z.string(),
  remarks: z.string().optional(),
});
