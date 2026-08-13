import { z } from 'zod';

export const scheduleReportSchema = z.object({
  reportType: z.string().min(1, 'Please select a report type'),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly']),
  format: z.enum(['PDF', 'Excel', 'CSV']),
  recipients: z.string().min(1, 'Please enter at least one recipient email'),
  active: z.boolean().optional()
});

export type ScheduleReportForm = z.infer<typeof scheduleReportSchema>;

export const exportReportSchema = z.object({
  format: z.enum(['PDF', 'Excel', 'CSV']),
  includeCharts: z.boolean().optional(),
  includeRawData: z.boolean().optional(),
  dateRange: z.string().optional()
});

export type ExportReportForm = z.infer<typeof exportReportSchema>;
