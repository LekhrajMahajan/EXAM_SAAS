import { z } from 'zod';

export const widgetConfigSchema = z.object({
  id: z.string(),
  isVisible: z.boolean(),
  order: z.number(),
});

export const dashboardSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  layout: z.enum(['default', 'compact']),
  widgets: z.array(widgetConfigSchema),
});

export type DashboardSettingsForm = z.infer<typeof dashboardSettingsSchema>;
