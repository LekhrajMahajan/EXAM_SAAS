import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  getActivityLogById,
  getUserActivities,
  getModuleActivities,
  getRecentActivities,
  getActivityLogs,
  dashboard,
  statistics,
  softDeleteActivityLog,
  restoreActivityLog,
} from "./activityLog.controller";

import {
  activityLogIdSchema,
  userActivitySchema,
  moduleActivitySchema,
  recentActivitySchema,
  activityLogQuerySchema,
  dashboardSchema,
  statisticsSchema,
  deleteActivityLogSchema,
  restoreActivityLogSchema,
} from "./activityLog.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(dashboardSchema),

  dashboard,
);

router.get(
  "/statistics",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(statisticsSchema),

  statistics,
);

/*
|--------------------------------------------------------------------------
| Recent Activities
|--------------------------------------------------------------------------
*/

router.get(
  "/recent",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.CANDIDATE,
  ),

  validateRequest(recentActivitySchema),

  getRecentActivities,
);

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

router.get(
  "/user/:userId",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(userActivitySchema),

  getUserActivities,
);

router.get(
  "/module/:module",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(moduleActivitySchema),

  getModuleActivities,
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(activityLogQuerySchema),

  getActivityLogs,
);

router.get(
  "/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(activityLogIdSchema),

  getActivityLogById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(deleteActivityLogSchema),

  softDeleteActivityLog,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(restoreActivityLogSchema),

  restoreActivityLog,
);

export default router;
