import { Schema, model } from "mongoose";

import {
  INotification,
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from "./notification.types";

/*
|--------------------------------------------------------------------------
| Notification Schema
|--------------------------------------------------------------------------
*/

const notificationSchema = new Schema<INotification>(
  {
    /*
            |--------------------------------------------------------------------------
            | Content
            |--------------------------------------------------------------------------
            */

    title: {
      type: String,

      required: true,

      trim: true,

      maxlength: 255,
    },

    message: {
      type: String,

      required: true,

      trim: true,

      maxlength: 5000,
    },

    type: {
      type: String,

      enum: Object.values(NotificationType),

      required: true,

      index: true,
    },

    channel: {
      type: String,

      enum: Object.values(NotificationChannel),

      required: true,

      index: true,
    },

    priority: {
      type: String,

      enum: Object.values(NotificationPriority),

      default: NotificationPriority.MEDIUM,

      index: true,
    },

    status: {
      type: String,

      enum: Object.values(NotificationStatus),

      default: NotificationStatus.PENDING,

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Recipient
            |--------------------------------------------------------------------------
            */

    recipientId: {
      type: Schema.Types.ObjectId,

      required: true,

      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Company",

      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",

      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidate",

      index: true,
    },

    employeeId: {
      type: Schema.Types.ObjectId,

      ref: "Employee",

      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Delivery
            |--------------------------------------------------------------------------
            */

    email: {
      type: String,

      trim: true,

      lowercase: true,
    },

    phone: {
      type: String,

      trim: true,
    },

    deviceToken: {
      type: String,

      trim: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Template
            |--------------------------------------------------------------------------
            */

    templateId: {
      type: String,

      trim: true,
    },

    templateVariables: {
      type: Schema.Types.Mixed,

      default: {},
    },

    attachments: {
      type: [String],

      default: [],
    },

    /*
            |--------------------------------------------------------------------------
            | Schedule
            |--------------------------------------------------------------------------
            */

    scheduledAt: Date,

    sentAt: Date,

    deliveredAt: Date,

    readAt: Date,

    /*
            |--------------------------------------------------------------------------
            | Retry
            |--------------------------------------------------------------------------
            */

    retryCount: {
      type: Number,

      default: 0,

      min: 0,
    },

    failureReason: {
      type: String,

      trim: true,

      maxlength: 5000,
    },

    /*
            |--------------------------------------------------------------------------
            | Metadata
            |--------------------------------------------------------------------------
            */

    metadata: {
      type: Schema.Types.Mixed,

      default: {},
    },

    /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    isDeleted: {
      type: Boolean,

      default: false,

      index: true,
    },

    deletedAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

notificationSchema.index({
  recipientId: 1,

  status: 1,
});

notificationSchema.index({
  candidateId: 1,

  createdAt: -1,
});

notificationSchema.index({
  employeeId: 1,

  createdAt: -1,
});

notificationSchema.index({
  companyId: 1,

  branchId: 1,
});

notificationSchema.index({
  examId: 1,

  type: 1,
});

notificationSchema.index({
  channel: 1,

  status: 1,
});

notificationSchema.index({
  priority: 1,

  scheduledAt: 1,
});

notificationSchema.index({
  isDeleted: 1,

  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
