import { z } from 'zod';

export const refundRequestSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  refundType: z.enum(['Full', 'Partial']),
  amount: z.number().min(1, 'Refund amount must be greater than 0').optional(),
}).superRefine((data, ctx) => {
  if (data.refundType === 'Partial' && !data.amount) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['amount'], message: 'Amount is required for partial refund' });
  }
});

export type RefundRequestForm = z.infer<typeof refundRequestSchema>;

export const feeConfigSchema = z.object({
  feeType: z.enum(['Application Fee', 'Exam Fee', 'Late Fee', 'Additional Charge', 'Re-Exam Fee']),
  exam: z.string().min(1, 'Exam is required'),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0, 'Amount must be 0 or more'),
  taxPercent: z.number().min(0).max(100),
  isActive: z.boolean(),
});

export type FeeConfigForm = z.infer<typeof feeConfigSchema>;

export const paymentSettingsSchema = z.object({
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  taxPercent: z.number().min(0).max(100),
  receiptPrefix: z.string().min(1, 'Receipt prefix is required').max(10),
  invoicePrefix: z.string().min(1, 'Invoice prefix is required').max(10),
  autoReceipt: z.boolean(),
  lateFeeDays: z.number().min(0),
  lateFeeAmount: z.number().min(0),
});

export type PaymentSettingsForm = z.infer<typeof paymentSettingsSchema>;
