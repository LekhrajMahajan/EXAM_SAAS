import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

import { UserRole } from "../../constants/roles";

import {
  getHealth,
  getLiveness,
  getReadiness,
  getSystemInformation,
  getDatabaseHealth,
  getRedisHealth,
  getQueueHealth,
  getStorageHealth,
  getSMTPHealth,
  getSMSHealth,
  getPushNotificationHealth,
} from "./health.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Health Endpoints
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  getHealth,
);

router.get(
  "/live",

  getLiveness,
);

router.get(
  "/ready",

  getReadiness,
);

/*
|--------------------------------------------------------------------------
| Protected Health Endpoints
|--------------------------------------------------------------------------
*/

router.get(
  "/system",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSystemInformation,
);

router.get(
  "/database",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getDatabaseHealth,
);

router.get(
  "/redis",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getRedisHealth,
);

router.get(
  "/queue",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getQueueHealth,
);

router.get(
  "/storage",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getStorageHealth,
);

router.get(
  "/smtp",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSMTPHealth,
);

router.get(
  "/sms",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSMSHealth,
);

router.get(
  "/push",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getPushNotificationHealth,
);

export default router;
