import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import reportService from "./report.service";
import masterReportService from "./master-report.service";
import { ReportStatus } from "./report.types";

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

export const generateReport = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportService.generate(
      req.body,
      req.user?.userId as string,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Master Report
|--------------------------------------------------------------------------
*/

export const generateMasterReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { modules, saveRecord, ...filters } = req.body;
    
    if (!modules || !Array.isArray(modules) || modules.length === 0) {
      return sendResponse(res, httpStatus.BAD_REQUEST, {
        success: false,
        message: "At least one module must be selected for Master Report",
        data: null
      });
    }

    const { buffer, successful, failed } = await masterReportService.generateMasterReport(
      modules,
      filters,
      req.user?.userId as string,
      saveRecord !== false
    );

    const filename = `Master_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("X-Report-Success", successful.join(','));
    res.setHeader("X-Report-Failed", failed.join(','));
    res.setHeader("Access-Control-Expose-Headers", "X-Report-Success, X-Report-Failed, Content-Disposition");
    
    res.status(httpStatus.OK).end(buffer);
  },
);

/*
|--------------------------------------------------------------------------
| Generate Candidate Report
|--------------------------------------------------------------------------
*/

export const generateCandidateReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateCandidateReport(
      req.body,
      req.user?.userId as string,
    );

    const filename = `Candidate_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

/*
|--------------------------------------------------------------------------
| Generate Exam Report
|--------------------------------------------------------------------------
*/

export const generateExamReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateExamReport(
      req.body,
      req.user?.userId as string,
    );
    const filename = `Exam_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

/*
|--------------------------------------------------------------------------
| Generate Result Report
|--------------------------------------------------------------------------
*/

export const generateResultReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateResultReport(
      req.body,
      req.user?.userId as string,
    );
    const filename = `Result_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

/*
|--------------------------------------------------------------------------
| Generate Attendance Report
|--------------------------------------------------------------------------
*/

export const generateAttendanceReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateAttendanceReport(
      req.body,
      req.user?.userId as string,
    );
    const filename = `Attendance_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

/*
|--------------------------------------------------------------------------
| Generate Biometric Report
|--------------------------------------------------------------------------
*/

export const generateBiometricReport = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportService.generateBiometricReport(
      req.body,

      req.user?.userId as string,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Biometric report generated successfully.",

      data: report,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Live Monitoring Report
|--------------------------------------------------------------------------
*/

export const generateLiveMonitoringReport = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportService.generateLiveMonitoringReport(
      req.body,

      req.user?.userId as string,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Live monitoring report generated successfully.",

      data: report,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Custom Report
|--------------------------------------------------------------------------
*/

export const generateCustomReport = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportService.generateCustomReport(
      req.body,

      req.user?.userId as string,
    );

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Custom report generated successfully.",

      data: report,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Report By Id
|--------------------------------------------------------------------------
*/

export const getReportById = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportService.getById(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Report fetched successfully.",

      data: report,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Reports
|--------------------------------------------------------------------------
*/

export const getReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await reportService.getAll(_req.query);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Reports fetched successfully.",

    data: reports,
  });
});

/*
|--------------------------------------------------------------------------
| Update Report Status
|--------------------------------------------------------------------------
*/

export const updateReportStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await reportService.updateStatus(
      req.params.id as string,

      req.body.status as ReportStatus,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Report status updated successfully.",

      data: report,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Report
|--------------------------------------------------------------------------
*/

export const deleteReport = asyncHandler(
  async (req: Request, res: Response) => {
    await reportService.delete(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Report deleted successfully.",
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await reportService.getDashboard(
      req.query,
      req.user?.userId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Reports dashboard fetched successfully",
      data: dashboard,
    });
  },
);

export const getStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await reportService.getStatistics(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Reports statistics fetched successfully",
      data: stats,
    });
  },
);

export const getRecent = asyncHandler(async (req: Request, res: Response) => {
  const recent = await reportService.getRecent(req.query);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Recent reports fetched successfully",
    data: recent,
  });
});

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await reportService.getCategories();

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Report categories fetched successfully",
      data: categories,
    });
  },
);

export const toggleFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await reportService.toggleFavorite(
      req.params.id as string,
      req.user?.userId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: result.isFavorite
        ? "Report pinned to favorites"
        : "Report unpinned from favorites",
      data: result,
    });
  },
);

export const incrementDownload = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await reportService.incrementDownload(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Download count incremented",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| User Access Report - Summary
|--------------------------------------------------------------------------
*/

export const getUserReportSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getUserReportSummary(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "User report summary fetched successfully",
      data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| User Access Report - Users List
|--------------------------------------------------------------------------
*/

export const getUsersList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getUsersList(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Users list fetched successfully",
      data: data.data,
      pagination: data.pagination,
    });
  },
);

/*
|--------------------------------------------------------------------------
| User Access Report - Login History
|--------------------------------------------------------------------------
*/

export const getUserLoginHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await reportService.getUserLoginHistory(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Login history fetched successfully",
      data: {
        records: result.data,
        stats: result.stats,
        loginsByDay: result.loginsByDay,
      },
      pagination: result.pagination,
    });
  },
);

/*
|--------------------------------------------------------------------------
| User Access Report - Roles Report
|--------------------------------------------------------------------------
*/

export const getUserRolesReport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getUserRolesReport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "User roles report fetched successfully",
      data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| User Access Report - Export
|--------------------------------------------------------------------------
*/

export const getUsersExport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getUsersExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Users export data fetched successfully",
      data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Reports
|--------------------------------------------------------------------------
*/

export const getCandidateSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getCandidateSummary(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Candidate summary fetched successfully",
      data,
    });
  },
);

export const getCandidateList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getCandidateList(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Candidate list fetched successfully",
      data: data.data,
      pagination: data.pagination,
    });
  },
);

export const getCandidateExport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getCandidateExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Candidate export data fetched successfully",
      data: data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Exam Reports
|--------------------------------------------------------------------------
*/

export const getExamSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getExamSummary(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam summary fetched successfully",
      data,
    });
  },
);

export const getExamList = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getExamList(req.query);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Exam list fetched successfully",
    data: data.data,
    pagination: data.pagination,
  });
});

export const getExamExport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getExamExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam export data fetched successfully",
      data: data.data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Attendance Reports
|--------------------------------------------------------------------------
*/

export const getAttendanceSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getAttendanceSummary(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Attendance summary fetched successfully",
      data,
    });
  },
);

export const getAttendanceList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getAttendanceList(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Attendance list fetched successfully",
      data: data.data,
      pagination: data.pagination,
    });
  },
);

export const getAttendanceExport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getAttendanceExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Attendance export data fetched successfully",
      data: data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Result Reports
|--------------------------------------------------------------------------
*/

export const getResultSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getResultSummary(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Result summary fetched successfully",
      data: data,
    });
  },
);

export const getResultList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getResultList(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Result list fetched successfully",
      data: data.data,
      pagination: data.pagination,
    });
  },
);

export const getResultExport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getResultExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Result export data fetched successfully",
      data: data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Financial Reports
|--------------------------------------------------------------------------
*/

export const generateFinancialReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateFinancialReport(
      req.body,
      req.user?.userId as string,
    );
    const filename = `Financial_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

export const getFinancialSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getFinancialSummary(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Financial summary fetched successfully",
      data,
    });
  },
);

export const getFinancialList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getFinancialList(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Financial list fetched successfully",
      data: data.data,
      pagination: data.pagination,
    });
  },
);

export const getFinancialExport = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getFinancialExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Financial export data fetched successfully",
      data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Security Reports
|--------------------------------------------------------------------------
*/

export const generateSecurityReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateSecurityReport(
      req.body,
      req.user?.userId as string,
    );
    const filename = `Security_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);

export const getSecurityStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getSecurityStatistics();
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Security statistics fetched successfully",
      data,
    });
  },
);

export const getSecurityReportsList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getSecurityList(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Security reports fetched successfully",
      data: data.data,
      pagination: data.meta,
    });
  },
);

export const exportSecurityReports = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await reportService.getSecurityExport(req.query);
    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Security reports exported successfully",
      data,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate User & Access Report
|--------------------------------------------------------------------------
*/

export const generateUserReport = asyncHandler(
  async (req: Request, res: Response) => {
    const pdfBuffer = await reportService.generateUserReport(
      req.body,
      req.user?.userId as string,
    );
    const filename = `User_Access_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(httpStatus.OK).end(pdfBuffer);
  },
);
