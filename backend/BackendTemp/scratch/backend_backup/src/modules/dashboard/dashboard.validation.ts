import { z } from "zod";

import { DashboardPeriod, DashboardWidget } from "./dashboard.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Dashboard Filter
|--------------------------------------------------------------------------
*/

export const dashboardFilterSchema = z.object({
  query: z.object({
    period: z.nativeEnum(DashboardPeriod).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    companyId: objectId.optional(),

    centerId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard Overview
|--------------------------------------------------------------------------
*/

export const overviewSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export const cardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Exam Dashboard
|--------------------------------------------------------------------------
*/

export const examDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Candidate Dashboard
|--------------------------------------------------------------------------
*/

export const candidateDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Result Dashboard
|--------------------------------------------------------------------------
*/

export const resultDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Attendance Dashboard
|--------------------------------------------------------------------------
*/

export const attendanceDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Live Monitoring Dashboard
|--------------------------------------------------------------------------
*/

export const liveMonitoringDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Question Bank Dashboard
|--------------------------------------------------------------------------
*/

export const questionBankDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Company Dashboard
|--------------------------------------------------------------------------
*/

export const companyDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Center Dashboard
|--------------------------------------------------------------------------
*/

export const centerDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Employee Dashboard
|--------------------------------------------------------------------------
*/

export const employeeDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Activity Dashboard
|--------------------------------------------------------------------------
*/

export const activityDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Queue Dashboard
|--------------------------------------------------------------------------
*/

export const queueDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Notification Dashboard
|--------------------------------------------------------------------------
*/

export const notificationDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| System Health Dashboard
|--------------------------------------------------------------------------
*/

export const systemHealthDashboardSchema = dashboardFilterSchema;

/*
|--------------------------------------------------------------------------
| Dashboard Widget
|--------------------------------------------------------------------------
*/

export const dashboardWidgetSchema = z.object({
  params: z.object({
    widget: z.nativeEnum(DashboardWidget),
  }),
});
