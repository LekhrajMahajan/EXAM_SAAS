import { z } from "zod";

import {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from "./notification.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),

    message: z.string().min(1).max(5000),

    type: z.nativeEnum(NotificationType),

    channel: z.nativeEnum(NotificationChannel),

    priority: z.nativeEnum(NotificationPriority).optional(),

    recipientId: objectId,

    companyId: objectId.optional(),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    employeeId: objectId.optional(),

    email: z.string().email().optional(),

    phone: z.string().min(8).max(20).optional(),

    deviceToken: z.string().optional(),

    templateId: z.string().optional(),

    templateVariables: z.record(z.string(), z.any()).optional(),

    attachments: z.array(z.string()).optional(),

    scheduledAt: z.coerce.date().optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Notification Id
|--------------------------------------------------------------------------
*/

export const notificationIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Send Notification
|--------------------------------------------------------------------------
*/

export const sendNotificationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Bulk Send
|--------------------------------------------------------------------------
*/

export const bulkSendNotificationSchema = z.object({
  body: z.object({
    notificationIds: z.array(objectId).min(1),
  }),
});

/*
|--------------------------------------------------------------------------
| Schedule Notification
|--------------------------------------------------------------------------
*/

export const scheduleNotificationSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    scheduledAt: z.coerce.date(),
  }),
});

/*
|--------------------------------------------------------------------------
| Mark As Read
|--------------------------------------------------------------------------
*/

export const markAsReadSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Cancel Notification
|--------------------------------------------------------------------------
*/

export const cancelNotificationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreNotificationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteNotificationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const notificationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    recipientId: objectId.optional(),

    candidateId: objectId.optional(),

    employeeId: objectId.optional(),

    companyId: objectId.optional(),

    examId: objectId.optional(),

    channel: z.nativeEnum(NotificationChannel).optional(),

    type: z.nativeEnum(NotificationType).optional(),

    status: z.nativeEnum(NotificationStatus).optional(),

    priority: z.nativeEnum(NotificationPriority).optional(),
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

    examId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Candidate Notifications
|--------------------------------------------------------------------------
*/

export const candidateNotificationSchema = z.object({
  params: z.object({
    candidateId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Employee Notifications
|--------------------------------------------------------------------------
*/

export const employeeNotificationSchema = z.object({
  params: z.object({
    employeeId: objectId,
  }),
});

export const sendNotificationMockSchema = z.object({
  body: z.object({
    notificationType: z.string().optional(),
    deliveryChannels: z.array(z.string()).optional(),
    recipientType: z.string().optional(),
    recipientIds: z.string().optional(),
    examId: z.string().optional(),
    title: z.string().optional(),
    message: z.string().optional(),
    priority: z.string().optional(),
    scheduledAt: z.any().optional(),
    createdBy: z.any().optional()
  })
});
