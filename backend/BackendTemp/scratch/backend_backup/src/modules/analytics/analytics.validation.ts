import { z } from "zod";
import {
  AnalyticsPeriod,
  AnalyticsCategory,
  ChartType,
} from "./analytics.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Analytics Filter
|--------------------------------------------------------------------------
*/
export const analyticsFilterSchema = z.object({
  query: z.object({
    period: z.nativeEnum(AnalyticsPeriod).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    companyId: objectId.optional(),
    centerId: objectId.optional(),
    examId: objectId.optional(),
    subjectId: objectId.optional(),
    shiftId: objectId.optional(),
    roomId: objectId.optional(),
    department: z.string().optional(),
    role: z.string().optional(),
    employeeId: objectId.optional(),
    candidateId: objectId.optional(),
    status: z.string().optional(),
    verification: z.string().optional(),
    attendanceStatus: z.string().optional(),
    minTrustScore: z.coerce.number().optional(),
    maxTrustScore: z.coerce.number().optional(),
    search: z.string().optional(),
  }).passthrough(),
});

export const overviewAnalyticsSchema = analyticsFilterSchema;
export const candidateAnalyticsSchema = analyticsFilterSchema;
export const examAnalyticsSchema = analyticsFilterSchema;
export const resultAnalyticsSchema = analyticsFilterSchema;
export const attendanceAnalyticsSchema = analyticsFilterSchema;
export const questionAnalyticsSchema = analyticsFilterSchema;
export const companyAnalyticsSchema = analyticsFilterSchema;
export const branchAnalyticsSchema = analyticsFilterSchema;
export const centerAnalyticsSchema = analyticsFilterSchema;
export const employeeAnalyticsSchema = analyticsFilterSchema;
export const systemAnalyticsSchema = analyticsFilterSchema;
export const notificationAnalyticsSchema = analyticsFilterSchema;
export const queueAnalyticsSchema = analyticsFilterSchema;
export const dashboardAnalyticsSchema = analyticsFilterSchema;

export const assignmentAnalyticsSchema = analyticsFilterSchema;
export const financeAnalyticsSchema = analyticsFilterSchema;
export const liveAnalyticsSchema = analyticsFilterSchema;
export const trustAnalyticsSchema = analyticsFilterSchema;
export const heatmapAnalyticsSchema = analyticsFilterSchema;
export const searchAnalyticsSchema = analyticsFilterSchema;

export const chartAnalyticsSchema = z.object({
  query: z.object({
    category: z.nativeEnum(AnalyticsCategory).optional(),
    chartType: z.nativeEnum(ChartType).optional(),
    period: z.nativeEnum(AnalyticsPeriod).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).passthrough(),
});

export const exportAnalyticsSchema = z.object({
  body: z.object({
    category: z.string().default("EXECUTIVE"),
    format: z.enum(["PDF", "EXCEL", "CSV", "PRINT", "EMAIL"]),
    filter: z.record(z.string(), z.any()).optional(),
    recipients: z.array(z.string().email()).optional(),
    includeCharts: z.boolean().optional(),
    notes: z.string().optional(),
  }).passthrough(),
});

export const personalizationSchema = z.object({
  body: z.object({
    favoriteWidgets: z.array(z.string()).optional(),
    savedFilters: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        filter: z.record(z.string(), z.any()),
        isDefault: z.boolean().default(false),
      })
    ).optional(),
    customDashboard: z.array(
      z.object({
        widgetId: z.string(),
        position: z.number(),
        w: z.number(),
        h: z.number(),
        visible: z.boolean().default(true),
        colSpan: z.number().optional(),
      })
    ).optional(),
    compactMode: z.boolean().optional(),
    defaultLandingPage: z.string().optional(),
    refreshInterval: z.number().optional(),
  }).passthrough(),
});

export const scheduledReportSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
    reportType: z.string(),
    format: z.enum(["PDF", "EXCEL", "CSV"]).default("PDF"),
    recipients: z.array(z.string().email()),
    isActive: z.boolean().default(true),
  }).passthrough(),
});
