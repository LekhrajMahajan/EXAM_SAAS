import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { UserRole } from "../../constants/roles";
import User from "../auth/user.model";
import activityLogService from "./activityLog.service";

/**
 * Helper to get role-based scoping filters.
 * Center Managers only see logs from themselves, their staff, and their candidates.
 * Other roles (except Master Admin) are scoped by companyId.
 */
const getScopedFilters = async (req: Request, filters: Record<string, any> = {}) => {
  const scopedFilters = { ...filters };
  const user = req.user as any;

  if (user?.role === UserRole.MASTER_ADMIN) {
    return scopedFilters;
  }

  if (user?.role === UserRole.CENTER_MANAGER && user?.centerId) {
    const usersInCenter = await User.find({ centerId: user.centerId }).select('_id');
    const userIds = usersInCenter.map(u => u._id.toString());
    
    // Add the center manager's own ID if it's somehow not in the list
    if (!userIds.includes(user.userId)) {
      userIds.push(user.userId);
    }
    
    scopedFilters.performedBy = userIds;
  } else if (user?.companyId) {
    scopedFilters.companyId = user.companyId;
  }

  return scopedFilters;
};

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
    
    const { limit: _limit, ...filters } = req.query;
    const scopedFilters = await getScopedFilters(req, filters);

    const activities = await activityLogService.getRecent(limit, scopedFilters);

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
    const scopedQuery = await getScopedFilters(req, req.query);
    const activities = await activityLogService.getAll(scopedQuery);

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
  const scopedQuery = await getScopedFilters(req, req.query);
  const dashboard = await activityLogService.dashboard(scopedQuery);

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
  const scopedQuery = await getScopedFilters(req, req.query);
  const statistics = await activityLogService.statistics(scopedQuery);

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

export const seedExamManagerLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const logs = [];
    const types = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'DOWNLOAD'];
    const modules = ['Exams', 'Topics', 'Scheduling', 'Shifts', 'Authentication'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];

    for (let i = 0; i < 20; i++) {
      const isToday = i < 10;
      const date = new Date();
      if (!isToday) {
        date.setDate(date.getDate() - Math.floor(Math.random() * 7) - 1);
      }

      logs.push({
        title: `Exam Manager Action ${i + 1}`,
        description: `This is a dynamically generated log for testing purposes. Action ${i + 1} was performed.`,
        activityType: types[Math.floor(Math.random() * types.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        performedByRole: 'EXAM_MANAGER',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        visibility: 'COMPANY',
        createdAt: date,
        updatedAt: date,
        isDeleted: false,
      });
    }

    const mongoose = require('mongoose');
    await mongoose.model('ActivityLog').insertMany(logs);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Seed successful.",
      data: logs,
    });
  }
);
