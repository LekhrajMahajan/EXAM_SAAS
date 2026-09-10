/*
|--------------------------------------------------------------------------
| Push Provider
|--------------------------------------------------------------------------
*/

export enum PushProvider {
  FCM = "FCM",
}

/*
|--------------------------------------------------------------------------
| Notification Priority
|--------------------------------------------------------------------------
*/

export enum NotificationPriority {
  LOW = "LOW",

  NORMAL = "NORMAL",

  HIGH = "HIGH",
}

/*
|--------------------------------------------------------------------------
| Notification Type
|--------------------------------------------------------------------------
*/

export enum PushNotificationType {
  EXAM_REMINDER = "EXAM_REMINDER",

  RESULT = "RESULT",

  ADMIT_CARD = "ADMIT_CARD",

  CERTIFICATE = "CERTIFICATE",

  SYSTEM = "SYSTEM",

  ANNOUNCEMENT = "ANNOUNCEMENT",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| Send Push Notification
|--------------------------------------------------------------------------
*/

export interface ISendPushNotification {
  token: string | string[];

  title: string;

  body: string;

  image?: string;

  data?: Record<string, string>;

  provider?: PushProvider;

  priority?: NotificationPriority;
}
