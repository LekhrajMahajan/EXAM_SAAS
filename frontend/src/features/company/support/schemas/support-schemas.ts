import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject is too long'),
  category: z.enum(['Technical Issue', 'Billing', 'Exam Rules', 'Account Access', 'Feature Request', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  description: z.string().min(20, 'Please provide more details in the description (min 20 chars)'),
  relatedModule: z.string().optional(),
});

export type CreateTicketForm = z.infer<typeof createTicketSchema>;

export const assignmentSchema = z.object({
  assigneeType: z.enum(['User', 'Team']),
  assigneeId: z.string().min(1, 'Please select an assignee'),
  internalNote: z.string().optional(),
});

export type AssignmentForm = z.infer<typeof assignmentSchema>;

export const replySchema = z.object({
  content: z.string().min(5, 'Reply cannot be empty'),
  isInternal: z.boolean().default(false),
});

export type ReplyForm = z.infer<typeof replySchema>;
