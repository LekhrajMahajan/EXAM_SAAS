import { z } from 'zod';

export const exportSchema = z.object({
  module: z.enum(['Candidates', 'Employees', 'Subjects', 'QuestionBank', 'MeritList', 'Results', 'Centers'], {
    errorMap: () => ({ message: 'Please select a module to export' })
  }),
  format: z.enum(['CSV', 'Excel', 'JSON', 'PDF']),
  fields: z.array(z.string()).min(1, 'Please select at least one field to export'),
  filters: z.string().optional(), // Simple string to represent applied filters for mockup
});

export type ExportForm = z.infer<typeof exportSchema>;

export const importSchema = z.object({
  module: z.enum(['Candidates', 'Employees', 'Subjects', 'QuestionBank', 'MeritList', 'Results', 'Centers'], {
    errorMap: () => ({ message: 'Please select a module to import data into' })
  }),
  duplicateAction: z.enum(['Skip', 'Overwrite', 'Fail']),
});

export type ImportForm = z.infer<typeof importSchema>;

export const settingsSchema = z.object({
  defaultExportFormat: z.enum(['CSV', 'Excel', 'JSON', 'PDF']),
  maxFileSizeMB: z.number().min(1).max(500),
  allowedExtensions: z.string(),
  notifyOnCompletion: z.boolean(),
});

export type SettingsForm = z.infer<typeof settingsSchema>;
