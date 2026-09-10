import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  sendPushNotification,
  sendBulkPushNotification,
  sendExamReminder,
  sendResultNotification,
  sendSystemNotification,
  sendCustomNotification,
  subscribeTopic,
  unsubscribeTopic,
  sendTopicNotification,
} from "./pushNotification.controller";

import {
  sendPushNotificationSchema,
  sendBulkPushNotificationSchema,
  examReminderNotificationSchema,
  resultNotificationSchema,
  systemNotificationSchema,
  customNotificationSchema,
} from "./pushNotification.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Push Notification
|--------------------------------------------------------------------------
*/

router.post(
  "/send",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(sendPushNotificationSchema),

  sendPushNotification,
);

router.post(
  "/send-bulk",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(sendBulkPushNotificationSchema),

  sendBulkPushNotification,
);

/*
|--------------------------------------------------------------------------
| Exam Notifications
|--------------------------------------------------------------------------
*/

router.post(
  "/exam-reminder",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(examReminderNotificationSchema),

  sendExamReminder,
);

router.post(
  "/result",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(resultNotificationSchema),

  sendResultNotification,
);

/*
|--------------------------------------------------------------------------
| System Notification
|--------------------------------------------------------------------------
*/

router.post(
  "/system",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(systemNotificationSchema),

  sendSystemNotification,
);

router.post(
  "/custom",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(customNotificationSchema),

  sendCustomNotification,
);

/*
|--------------------------------------------------------------------------
| Topic Management
|--------------------------------------------------------------------------
*/

router.post(
  "/topic/subscribe",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  subscribeTopic,
);

router.post(
  "/topic/unsubscribe",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  unsubscribeTopic,
);

router.post(
  "/topic/send",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  sendTopicNotification,
);

export default router;
