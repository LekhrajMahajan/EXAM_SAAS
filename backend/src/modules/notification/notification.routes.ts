import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createNotification,
  sendNotification,
  bulkSendNotifications,
  scheduleNotification,
  markNotificationAsRead,
  cancelNotification,
  retryFailedNotification,
  getNotificationById,
  getRecipientNotifications,
  getCandidateNotifications,
  getEmployeeNotifications,
  getNotifications,
  dashboard,
  statistics,
  softDeleteNotification,
  restoreNotification,
  sendNotificationMock,
} from "./notification.controller";

import {
  createNotificationSchema,
  notificationIdSchema,
  sendNotificationSchema,
  bulkSendNotificationSchema,
  scheduleNotificationSchema,
  markAsReadSchema,
  cancelNotificationSchema,
  restoreNotificationSchema,
  deleteNotificationSchema,
  notificationQuerySchema,
  dashboardSchema,
  statisticsSchema,
  candidateNotificationSchema,
  employeeNotificationSchema,
  sendNotificationMockSchema,
} from "./notification.validation";

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
  ),

  validate(dashboardSchema),

  dashboard,
);

router.get(
  "/statistics",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(statisticsSchema),

  statistics,
);

/*
|--------------------------------------------------------------------------
| Recipient Notifications
|--------------------------------------------------------------------------
*/

router.get(
  "/candidate/:candidateId",

  authenticate,

  authorize(
    UserRole.CANDIDATE,

    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(candidateNotificationSchema),

  getCandidateNotifications,
);

router.get(
  "/employee/:employeeId",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(employeeNotificationSchema),

  getEmployeeNotifications,
);

router.get(
  "/recipient/:recipientId",

  authenticate,

  validate(notificationIdSchema),

  getRecipientNotifications,
);

/*
|--------------------------------------------------------------------------
| Notification Workflow
|--------------------------------------------------------------------------
*/

router.post(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(createNotificationSchema),

  createNotification,
);

router.post(
  "/bulk-send",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(bulkSendNotificationSchema),

  bulkSendNotifications,
);

router.post(
  "/send",

  authenticate,

  validate(sendNotificationMockSchema),

  sendNotificationMock,
);

router.patch(
  "/:id/send",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(sendNotificationSchema),

  sendNotification,
);

router.patch(
  "/:id/schedule",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(scheduleNotificationSchema),

  scheduleNotification,
);

router.patch(
  "/:id/read",

  authenticate,

  validate(markAsReadSchema),

  markNotificationAsRead,
);

router.patch(
  "/:id/retry",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(notificationIdSchema),

  retryFailedNotification,
);

router.patch(
  "/:id/cancel",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(cancelNotificationSchema),

  cancelNotification,
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

  validate(notificationQuerySchema),

  getNotifications,
);

router.get(
  "/:id",

  authenticate,

  validate(notificationIdSchema),

  getNotificationById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(deleteNotificationSchema),

  softDeleteNotification,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(restoreNotificationSchema),

  restoreNotification,
);

export default router;
