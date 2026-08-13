import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import analyticsService from "./analytics.service";

import { IAnalyticsFilter } from "./analytics.types";

/*
|--------------------------------------------------------------------------
| Overview
|--------------------------------------------------------------------------
*/

export const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const analytics = await analyticsService.getOverview(
    req.query as IAnalyticsFilter,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Overview analytics fetched successfully.",

    data: analytics,
  });
});

/*
|--------------------------------------------------------------------------
| Candidate Analytics
|--------------------------------------------------------------------------
*/

export const getCandidateAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getCandidateAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Candidate analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Exam Analytics
|--------------------------------------------------------------------------
*/

export const getExamAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getExamAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Exam analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Result Analytics
|--------------------------------------------------------------------------
*/

export const getResultAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getResultAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Result analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Attendance Analytics
|--------------------------------------------------------------------------
*/

export const getAttendanceAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getAttendanceAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Attendance analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Question Analytics
|--------------------------------------------------------------------------
*/

export const getQuestionAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getQuestionAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Question analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Company Analytics
|--------------------------------------------------------------------------
*/

export const getCompanyAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getCompanyAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Company analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Branch Analytics
|--------------------------------------------------------------------------
*/

export const getBranchAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getBranchAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Branch analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Center Analytics
|--------------------------------------------------------------------------
*/

export const getCenterAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getCenterAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Center analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Employee Analytics
|--------------------------------------------------------------------------
*/

export const getEmployeeAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getEmployeeAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Employee analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Notification Analytics
|--------------------------------------------------------------------------
*/

export const getNotificationAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getNotificationAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Notification analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Queue Analytics
|--------------------------------------------------------------------------
*/

export const getQueueAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    const analytics = await analyticsService.getQueueAnalytics();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Queue analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| System Analytics
|--------------------------------------------------------------------------
*/

export const getSystemAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    const analytics = await analyticsService.getSystemAnalytics();

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "System analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

export const getDashboardAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getDashboardAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Dashboard analytics fetched successfully.",

      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Chart Analytics
|--------------------------------------------------------------------------
*/

export const getChartAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getChartAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Chart analytics fetched successfully.",
      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Staff Assignment Analytics
|--------------------------------------------------------------------------
*/

export const getAssignmentAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getAssignmentAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Assignment analytics fetched successfully.",
      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Financial Analytics
|--------------------------------------------------------------------------
*/

export const getFinanceAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getFinanceAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Finance analytics fetched successfully.",
      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Live Monitoring Analytics
|--------------------------------------------------------------------------
*/

export const getLiveAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getLiveAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Live monitoring analytics fetched successfully.",
      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Trust Score Analytics
|--------------------------------------------------------------------------
*/

export const getTrustAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getTrustAnalytics(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Trust score analytics fetched successfully.",
      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Heatmap Analytics
|--------------------------------------------------------------------------
*/

export const getHeatmapAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getHeatmaps(
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Heatmap analytics fetched successfully.",
      data: analytics,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Global Analytics Search
|--------------------------------------------------------------------------
*/

export const searchAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const query = (req.query.q || req.query.query || "") as string;
    const results = await analyticsService.searchAnalytics(
      query,
      req.query as IAnalyticsFilter,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Analytics search completed successfully.",
      data: results,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Export Analytics
|--------------------------------------------------------------------------
*/

export const exportAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as unknown as { user: { _id: string } }).user;
    const result = await analyticsService.exportAnalytics(
      req.body || req.query,
      user?._id || "000000000000000000000000"
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Analytics exported successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard Personalization
|--------------------------------------------------------------------------
*/

export const getPersonalization = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as unknown as { user: { _id: string; companyId?: string } }).user;
    const userId = user?._id || "000000000000000000000000";
    const companyId = (req.query.companyId as string) || user?.companyId || "000000000000000000000000";

    const data = await analyticsService.getPersonalization(userId, companyId);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Dashboard personalization fetched successfully.",
      data,
    });
  },
);

export const savePersonalization = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as unknown as { user: { _id: string; companyId?: string } }).user;
    const userId = user?._id || "000000000000000000000000";
    const companyId = (req.body.companyId as string) || user?.companyId || "000000000000000000000000";

    const data = await analyticsService.savePersonalization(userId, companyId, req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Dashboard personalization saved successfully.",
      data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Scheduled Reports
|--------------------------------------------------------------------------
*/

export const scheduleReport = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as unknown as { user: { _id: string } }).user;
    const result = await analyticsService.createScheduledReport(
      req.body,
      user?._id || "000000000000000000000000"
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Report scheduled successfully.",
      data: result,
    });
  },
);

