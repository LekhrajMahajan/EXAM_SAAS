import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  getAuditLogById,
  getUserAuditLogs,
  getModuleAuditLogs,
  getAuditLogs,
  dashboard,
  statistics,
  softDeleteAuditLog,
  restoreAuditLog,
} from "./auditLog.controller";

import {
  auditLogIdSchema,
  userAuditSchema,
  moduleAuditSchema,
  auditLogQuerySchema,
  dashboardSchema,
  statisticsSchema,
  deleteAuditLogSchema,
  restoreAuditLogSchema,
} from "./auditLog.validation";

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

  validateRequest(userAuditSchema),

  getUserAuditLogs,
);

router.get(
  "/module/:module",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(moduleAuditSchema),

  getModuleAuditLogs,
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

  validateRequest(auditLogQuerySchema),

  getAuditLogs,
);

router.get(
  "/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(auditLogIdSchema),

  getAuditLogById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(deleteAuditLogSchema),

  softDeleteAuditLog,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(restoreAuditLogSchema),

  restoreAuditLog,
);

export default router;
