import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { NotificationChannel, NotificationPriority, NotificationStatus, NotificationType } from "./notification.types";

import notificationService from "./notification.service";

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const createNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.create(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Notification created successfully.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Notification
|--------------------------------------------------------------------------
*/

export const sendNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.send(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification sent successfully.",

      data: notification,
    });
  },
);

import { Types } from "mongoose";
import Notification from "./notification.model";

export const sendNotificationMock = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, message, notificationType, deliveryChannels, priority, recipientId, email } = req.body;
    
    await Notification.create({
      title: title || "Mock Notification",
      message: message || "This is a mocked notification.",
      type: notificationType || NotificationType.EXAM_REMINDER,
      channel: (deliveryChannels && deliveryChannels.length > 0) ? deliveryChannels[0] : NotificationChannel.EMAIL,
      priority: priority || NotificationPriority.MEDIUM,
      status: NotificationStatus.SENT,
      recipientId: recipientId ? new Types.ObjectId(recipientId) : new Types.ObjectId(),
      email: email || "mock@example.com",
      retryCount: 0,
      sentAt: new Date()
    });

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Notifications sent successfully",
      data: {
        totalRecipients: 2,
        successfulDeliveries: 2,
        failedDeliveries: 0,
        notificationType: req.body.notificationType || "EXAM_REMINDER"
      }
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Send Notifications
|--------------------------------------------------------------------------
*/

export const bulkSendNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.bulkSend(
      req.body.notificationIds,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Bulk notifications processed successfully.",

      data: notifications,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Schedule Notification
|--------------------------------------------------------------------------
*/

export const scheduleNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.schedule(
      req.params.id as string,

      req.body.scheduledAt,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification scheduled successfully.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Mark As Read
|--------------------------------------------------------------------------
*/

export const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.markAsRead(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification marked as read.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Cancel Notification
|--------------------------------------------------------------------------
*/

export const cancelNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.cancel(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification cancelled successfully.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Retry Failed Notification
|--------------------------------------------------------------------------
*/

export const retryFailedNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.retryFailed(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification queued for retry.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Notification By Id
|--------------------------------------------------------------------------
*/

export const getNotificationById = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.getById(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification fetched successfully.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Recipient Notifications
|--------------------------------------------------------------------------
*/

export const getRecipientNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.getByRecipient(
      req.params.recipientId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Recipient notifications fetched successfully.",

      data: notifications,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Candidate Notifications
|--------------------------------------------------------------------------
*/

export const getCandidateNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.getByCandidate(
      req.params.candidateId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Candidate notifications fetched successfully.",

      data: notifications,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Employee Notifications
|--------------------------------------------------------------------------
*/

export const getEmployeeNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.getByEmployee(
      req.params.employeeId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Employee notifications fetched successfully.",

      data: notifications,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.getAll(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notifications fetched successfully.",

      data: notifications,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await notificationService.dashboard(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Notification dashboard fetched successfully.",

    data: dashboard,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const statistics = await notificationService.statistics(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Notification statistics fetched successfully.",

    data: statistics,
  });
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const softDeleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.delete(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification deleted successfully.",

      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.restore(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification restored successfully.",

      data: notification,
    });
  },
);
