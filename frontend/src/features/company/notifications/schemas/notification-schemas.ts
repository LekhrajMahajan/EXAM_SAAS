import { z } from 'zod';

export const broadcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(1000),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']),
  category: z.enum(['System', 'Exam', 'Result', 'Marketing', 'Alert']),
  methods: z.array(z.string()).min(1, 'Select at least one delivery method'),
  
  // Audience Targeting
  targetAudience: z.enum(['All', 'Specific Roles', 'Specific Branches', 'Specific Centers']),
  roles: z.array(z.string()).optional(),
  branches: z.array(z.string()).optional(),
  centers: z.array(z.string()).optional(),
  
  // Scheduling
  scheduleType: z.enum(['Immediate', 'Scheduled']),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
}).refine(data => {
  if (data.scheduleType === 'Scheduled') {
    return !!data.scheduledDate && !!data.scheduledTime;
  }
  return true;
}, {
  message: 'Scheduled date and time are required when scheduling a broadcast',
  path: ['scheduledDate'],
});

export type BroadcastForm = z.infer<typeof broadcastSchema>;

export const preferenceSchema = z.object({
  examAlerts: z.boolean(),
  resultUpdates: z.boolean(),
  marketingEmails: z.boolean(),
  systemAnnouncements: z.boolean(),
});

export type PreferenceForm = z.infer<typeof preferenceSchema>;
