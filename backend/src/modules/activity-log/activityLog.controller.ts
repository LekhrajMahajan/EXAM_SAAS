import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import activityLogService from "./activityLog.service";

/*
|--------------------------------------------------------------------------
| Get Activity Log By Id
|--------------------------------------------------------------------------
*/

export const getActivityLogById = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await activityLogService.getById(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Activity log fetched successfully.",
      data: activity,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get User Activities
|--------------------------------------------------------------------------
*/

export const getUserActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const activities = await activityLogService.getByUser(
      req.params.userId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "User activities fetched successfully.",
      data: activities,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Module Activities
|--------------------------------------------------------------------------
*/

export const getModuleActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const activities = await activityLogService.getByModule(
      req.params.module as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Module activities fetched successfully.",
      data: activities,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Recent Activities
|--------------------------------------------------------------------------
*/

export const getRecentActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const activities = await activityLogService.getRecent(limit);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Recent activities fetched successfully.",
      data: activities,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Activities
|--------------------------------------------------------------------------
*/

export const getActivityLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const activities = await activityLogService.getAll(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Activity logs fetched successfully.",
      data: activities,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await activityLogService.dashboard(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Activity dashboard fetched successfully.",
    data: dashboard,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const statistics = await activityLogService.statistics(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Activity statistics fetched successfully.",
    data: statistics,
  });
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const softDeleteActivityLog = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await activityLogService.softDelete(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Activity log deleted successfully.",
      data: activity,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreActivityLog = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await activityLogService.restore(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Activity log restored successfully.",
      data: activity,
    });
  },
);
