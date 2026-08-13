import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import dashboardService from "./dashboard.service";
import type { JwtPayload } from "../../middleware/authenticate";

/*
|--------------------------------------------------------------------------
| Role-Based Dashboard Stats
|--------------------------------------------------------------------------
*/

export const getRoleStats = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const stats = await dashboardService.getRoleStats(
    user.userId,
    user.role as string,
    user.companyId,
    user.branchId,
    user.centerId
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Role dashboard stats fetched successfully.",
    data: stats,
  });
});

/*
|--------------------------------------------------------------------------
| Dashboard Overview
|--------------------------------------------------------------------------
*/

export const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const overview = await dashboardService.getOverview(req.query);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Dashboard overview fetched successfully.",

    data: overview,
  });
});

export const getDashboardCharts = asyncHandler(async (req: Request, res: Response) => {
  const charts = await dashboardService.getDashboardCharts(req.query);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Dashboard charts fetched successfully.",
    data: charts,
  });
});

/*
|--------------------------------------------------------------------------
| Dashboard Cards
|--------------------------------------------------------------------------
*/

export const getDashboardCards = asyncHandler(
  async (req: Request, res: Response) => {
    const cards = await dashboardService.getDashboardCards(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Dashboard cards fetched successfully.",

      data: cards,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Exam Statistics
|--------------------------------------------------------------------------
*/

export const getExamStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getExamStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Exam statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Statistics
|--------------------------------------------------------------------------
*/

export const getCandidateStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getCandidateStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Candidate statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Result Statistics
|--------------------------------------------------------------------------
*/

export const getResultStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getResultStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Result statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Attendance Statistics
|--------------------------------------------------------------------------
*/

export const getAttendanceStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getAttendanceStatistics(
      req.query,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Attendance statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Live Monitoring Statistics
|--------------------------------------------------------------------------
*/

export const getLiveMonitoringStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getLiveMonitoringStatistics(
      req.query,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Live monitoring statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Question Bank Statistics
|--------------------------------------------------------------------------
*/

export const getQuestionBankStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getQuestionBankStatistics(
      req.query,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Question bank statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Company Statistics
|--------------------------------------------------------------------------
*/

export const getCompanyStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getCompanyStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Company statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Center Statistics
|--------------------------------------------------------------------------
*/

export const getCenterStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getCenterStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Center statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Employee Statistics
|--------------------------------------------------------------------------
*/

export const getEmployeeStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getEmployeeStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Employee statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Activity Statistics
|--------------------------------------------------------------------------
*/

export const getActivityStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getActivityStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Activity statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Queue Statistics
|--------------------------------------------------------------------------
*/

export const getQueueStatistics = asyncHandler(
  async (_req: Request, res: Response) => {
    const statistics = await dashboardService.getQueueStatistics({});

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Queue statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Notification Statistics
|--------------------------------------------------------------------------
*/

export const getNotificationStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const statistics = await dashboardService.getNotificationStatistics(
      req.query,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification statistics fetched successfully.",

      data: statistics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| System Health
|--------------------------------------------------------------------------
*/

export const getSystemHealth = asyncHandler(
  async (_req: Request, res: Response) => {
    const health = await dashboardService.getSystemHealth();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System health fetched successfully.",

      data: health,
    });
  },
);
