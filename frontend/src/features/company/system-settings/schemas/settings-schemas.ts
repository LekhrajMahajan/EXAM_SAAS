import { z } from 'zod';

export const generalSettingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  dateFormat: z.string().min(1, 'Date format is required'),
  timeFormat: z.string().min(1, 'Time format is required'),
});

export type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>;

export const securitySettingsSchema = z.object({
  passwordMinLength: z.number().min(8).max(32),
  requireSpecialChar: z.boolean(),
  requireNumber: z.boolean(),
  requireUppercase: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440), // minutes
  maxFailedLogins: z.number().min(3).max(10),
});

export type SecuritySettingsForm = z.infer<typeof securitySettingsSchema>;

export const examPolicySchema = z.object({
  defaultDuration: z.number().min(10), // minutes
  defaultNegativeMarking: z.number().min(0).max(100), // percentage
  autoSubmitEnabled: z.boolean(),
  lateEntryAllowed: z.boolean(),
  lateEntryGracePeriod: z.number().min(0), // minutes
});

export type ExamPolicyForm = z.infer<typeof examPolicySchema>;
