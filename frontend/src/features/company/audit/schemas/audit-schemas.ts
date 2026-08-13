import { z } from 'zod';

export const exportAuditSchema = z.object({
  dateRange: z.enum(['Today', 'Last 7 Days', 'Last 30 Days', 'Custom']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  modules: z.array(z.string()).min(1, 'Select at least one module'),
  severity: z.array(z.string()).min(1, 'Select at least one severity level'),
  format: z.enum(['PDF', 'CSV', 'Excel']),
  passwordProtect: z.boolean(),
  password: z.string().optional(),
}).refine(data => {
  if (data.dateRange === 'Custom') {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: 'Start Date and End Date are required for Custom range',
  path: ['startDate'],
}).refine(data => {
  if (data.passwordProtect) {
    return !!data.password && data.password.length >= 8;
  }
  return true;
}, {
  message: 'Password must be at least 8 characters if protection is enabled',
  path: ['password'],
});

export type ExportAuditForm = z.infer<typeof exportAuditSchema>;

export const filterAuditSchema = z.object({
  searchTerm: z.string().optional(),
  dateRange: z.string().optional(),
  module: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
});

export type FilterAuditForm = z.infer<typeof filterAuditSchema>;
