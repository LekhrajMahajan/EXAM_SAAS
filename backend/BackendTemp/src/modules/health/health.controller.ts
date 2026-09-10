import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import healthService from "./health.service";

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const health = await healthService.getHealth();

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Application health fetched successfully.",

    data: health,
  });
});

/*
|--------------------------------------------------------------------------
| Liveness
|--------------------------------------------------------------------------
*/

export const getLiveness = asyncHandler(
  async (_req: Request, res: Response) => {
    const health = await healthService.getLiveness();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Liveness check completed successfully.",

      data: health,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Readiness
|--------------------------------------------------------------------------
*/

export const getReadiness = asyncHandler(
  async (_req: Request, res: Response) => {
    const readiness = await healthService.getReadiness();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Readiness check completed successfully.",

      data: readiness,
    });
  },
);

/*
|--------------------------------------------------------------------------
| System Information
|--------------------------------------------------------------------------
*/

export const getSystemInformation = asyncHandler(
  async (_req: Request, res: Response) => {
    const information = await healthService.getSystemInformation();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System information fetched successfully.",

      data: information,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Database Health
|--------------------------------------------------------------------------
*/

export const getDatabaseHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const database = await healthService.checkDatabase();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Database health fetched successfully.",

      data: database,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Redis Health
|--------------------------------------------------------------------------
*/

export const getRedisHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const redis = await healthService.checkRedis();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Redis health fetched successfully.",

      data: redis,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Queue Health
|--------------------------------------------------------------------------
*/

export const getQueueHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const queue = await healthService.checkQueue();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Queue health fetched successfully.",

      data: queue,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Storage Health
|--------------------------------------------------------------------------
*/

export const getStorageHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const storage = await healthService.checkStorage();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Storage health fetched successfully.",

      data: storage,
    });
  },
);

/*
|--------------------------------------------------------------------------
| SMTP Health
|--------------------------------------------------------------------------
*/

export const getSMTPHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const smtp = await healthService.checkSMTP();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "SMTP health fetched successfully.",

      data: smtp,
    });
  },
);

/*
|--------------------------------------------------------------------------
| SMS Health
|--------------------------------------------------------------------------
*/

export const getSMSHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const sms = await healthService.checkSMS();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "SMS provider health fetched successfully.",

      data: sms,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Push Notification Health
|--------------------------------------------------------------------------
*/

export const getPushNotificationHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const push = await healthService.checkPushNotification();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Push notification health fetched successfully.",

      data: push,
    });
  },
);
