import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  broadcastEvent,
  sendNotification,
  sendLiveMonitoring,
  sendSystemAlert,
} from "./websocket.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| Broadcast
|--------------------------------------------------------------------------
*/

router.post(
  "/broadcast",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  broadcastEvent,
);

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

router.post(
  "/notification",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  sendNotification,
);

/*
|--------------------------------------------------------------------------
| Live Monitoring
|--------------------------------------------------------------------------
*/

router.post(
  "/live-monitoring",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.OBSERVER,
  ),

  sendLiveMonitoring,
);

/*
|--------------------------------------------------------------------------
| System Alert
|--------------------------------------------------------------------------
*/

router.post(
  "/system-alert",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  sendSystemAlert,
);

export default router;
