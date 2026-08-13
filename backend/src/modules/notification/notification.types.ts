import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Notification Channel
|--------------------------------------------------------------------------
*/

export enum NotificationChannel {
  EMAIL = "EMAIL",

  SMS = "SMS",

  WHATSAPP = "WHATSAPP",

  PUSH = "PUSH",

  IN_APP = "IN_APP",
}

/*
|--------------------------------------------------------------------------
| Notification Status
|--------------------------------------------------------------------------
*/

export enum NotificationStatus {
  PENDING = "PENDING",

  QUEUED = "QUEUED",

  PROCESSING = "PROCESSING",

  SENT = "SENT",

  DELIVERED = "DELIVERED",

  READ = "READ",

  FAILED = "FAILED",

  CANCELLED = "CANCELLED",
}

/*
|--------------------------------------------------------------------------
| Notification Priority
|--------------------------------------------------------------------------
*/

export enum NotificationPriority {
  LOW = "LOW",

  MEDIUM = "MEDIUM",

  HIGH = "HIGH",

  CRITICAL = "CRITICAL",
}

/*
|--------------------------------------------------------------------------
| Notification Type
|--------------------------------------------------------------------------
*/

export enum NotificationType {
  LOGIN_OTP = "LOGIN_OTP",

  PASSWORD_RESET = "PASSWORD_RESET",

  EXAM_CREATED = "EXAM_CREATED",

  EXAM_UPDATED = "EXAM_UPDATED",

  ADMIT_CARD = "ADMIT_CARD",

  EXAM_REMINDER = "EXAM_REMINDER",

  EXAM_STARTED = "EXAM_STARTED",

  EXAM_COMPLETED = "EXAM_COMPLETED",

  RESULT_PUBLISHED = "RESULT_PUBLISHED",

  RESULT_APPROVED = "RESULT_APPROVED",

  CERTIFICATE_GENERATED = "CERTIFICATE_GENERATED",

  MERIT_PUBLISHED = "MERIT_PUBLISHED",

  SYSTEM = "SYSTEM",
}

/*
|--------------------------------------------------------------------------
| Notification Interface
|--------------------------------------------------------------------------
*/

export interface INotification {
  title: string;

  message: string;

  type: NotificationType;

  channel: NotificationChannel;

  priority: NotificationPriority;

  status: NotificationStatus;

  recipientId: Types.ObjectId;

  companyId?: Types.ObjectId;

  branchId?: Types.ObjectId;

  examId?: Types.ObjectId;

  candidateId?: Types.ObjectId;

  employeeId?: Types.ObjectId;

  email?: string;

  phone?: string;

  deviceToken?: string;

  templateId?: string;

  templateVariables?: Record<string, unknown>;

  attachments?: string[];

  scheduledAt?: Date;

  sentAt?: Date;

  deliveredAt?: Date;

  readAt?: Date;

  retryCount: number;

  failureReason?: string;

  metadata?: Record<string, unknown>;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type NotificationDocument = HydratedDocument<INotification>;
