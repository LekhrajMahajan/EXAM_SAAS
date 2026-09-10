import { z } from "zod";

import {
  NotificationPriority,
  PushNotificationType,
  PushProvider,
} from "./pushNotification.types";

/*
|--------------------------------------------------------------------------
| Device Token
|--------------------------------------------------------------------------
*/

const deviceToken = z.string().min(20).max(500);

/*
|--------------------------------------------------------------------------
| Send Push Notification
|--------------------------------------------------------------------------
*/

export const sendPushNotificationSchema = z.object({
  body: z.object({
    token: z.union([deviceToken, z.array(deviceToken).min(1)]),

    title: z.string().min(1).max(255),

    body: z.string().min(1).max(2000),

    image: z.string().url().optional(),

    data: z.record(z.string(), z.string()).optional(),

    provider: z.nativeEnum(PushProvider).optional(),

    priority: z.nativeEnum(NotificationPriority).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Send Bulk Push Notification
|--------------------------------------------------------------------------
*/

export const sendBulkPushNotificationSchema = z.object({
  body: z.object({
    tokens: z.array(deviceToken).min(1),

    title: z.string().min(1).max(255),

    body: z.string().min(1).max(2000),

    image: z.string().url().optional(),

    data: z.record(z.string(), z.string()).optional(),

    priority: z.nativeEnum(NotificationPriority).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Exam Reminder
|--------------------------------------------------------------------------
*/

export const examReminderNotificationSchema = z.object({
  body: z.object({
    token: deviceToken,

    examId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Exam Id."),
  }),
});

/*
|--------------------------------------------------------------------------
| Result Notification
|--------------------------------------------------------------------------
*/

export const resultNotificationSchema = z.object({
  body: z.object({
    token: deviceToken,

    resultId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Result Id."),
  }),
});

/*
|--------------------------------------------------------------------------
| System Notification
|--------------------------------------------------------------------------
*/

export const systemNotificationSchema = z.object({
  body: z.object({
    token: z.union([deviceToken, z.array(deviceToken).min(1)]),

    title: z.string().min(1).max(255),

    body: z.string().min(1).max(2000),

    priority: z.nativeEnum(NotificationPriority).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Custom Notification
|--------------------------------------------------------------------------
*/

export const customNotificationSchema = sendPushNotificationSchema;
