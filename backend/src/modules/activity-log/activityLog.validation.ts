import { z } from "zod";

import {
  ActivityType,
  ActivityPriority,
  ActivityVisibility,
} from "./activityLog.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Activity Log Id
|--------------------------------------------------------------------------
*/

export const activityLogIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreActivityLogSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteActivityLogSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| User Activity
|--------------------------------------------------------------------------
*/

export const userActivitySchema = z.object({
  params: z.object({
    userId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Module Activity
|--------------------------------------------------------------------------
*/

export const moduleActivitySchema = z.object({
  params: z.object({
    module: z.string().min(1).max(100),
  }),
});

/*
|--------------------------------------------------------------------------
| Recent Activities
|--------------------------------------------------------------------------
*/

export const recentActivitySchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});

/*
|--------------------------------------------------------------------------
| Activity Query
|--------------------------------------------------------------------------
*/

export const activityLogQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    employeeId: objectId.optional(),

    performedBy: objectId.optional(),

    activityType: z.nativeEnum(ActivityType).optional(),

    priority: z.nativeEnum(ActivityPriority).optional(),

    visibility: z.nativeEnum(ActivityVisibility).optional(),

    module: z.string().max(100).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statisticsSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examId: objectId.optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  }),
});
