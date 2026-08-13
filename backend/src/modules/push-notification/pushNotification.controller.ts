import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import pushNotificationService from "./pushNotification.service";

/*
|--------------------------------------------------------------------------
| Send Push Notification
|--------------------------------------------------------------------------
*/

export const sendPushNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await pushNotificationService.send(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Push notification sent successfully.",
      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Bulk Push Notification
|--------------------------------------------------------------------------
*/

export const sendBulkPushNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await pushNotificationService.sendBulk({
      ...req.body,

      token: req.body.tokens,
    });

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Bulk push notifications sent successfully.",
      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Exam Reminder
|--------------------------------------------------------------------------
*/

export const sendExamReminder = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await pushNotificationService.sendExamReminder(
      req.body.token,

      req.body.examId,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam reminder sent successfully.",
      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Result Notification
|--------------------------------------------------------------------------
*/

export const sendResultNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await pushNotificationService.sendResultNotification(
      req.body.token,

      req.body.resultId,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Result notification sent successfully.",
      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send System Notification
|--------------------------------------------------------------------------
*/

export const sendSystemNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await pushNotificationService.sendSystemNotification(
      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "System notification sent successfully.",
      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Custom Notification
|--------------------------------------------------------------------------
*/

export const sendCustomNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await pushNotificationService.sendCustomNotification(
      req.body,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Custom notification sent successfully.",
      data: notification,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Subscribe Topic
|--------------------------------------------------------------------------
*/

export const subscribeTopic = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await pushNotificationService.subscribeTopic(
      req.body.tokens,

      req.body.topic,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Topic subscribed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Unsubscribe Topic
|--------------------------------------------------------------------------
*/

export const unsubscribeTopic = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await pushNotificationService.unsubscribeTopic(
      req.body.tokens,

      req.body.topic,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Topic unsubscribed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Topic Notification
|--------------------------------------------------------------------------
*/

export const sendTopicNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await pushNotificationService.sendTopicNotification(
      req.body.topic,

      req.body.title,

      req.body.body,

      req.body.data,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Topic notification sent successfully.",
      data: result,
    });
  },
);
