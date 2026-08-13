import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import auditLogService from "./auditLog.service";

/*
|--------------------------------------------------------------------------
| Get Audit Log By Id
|--------------------------------------------------------------------------
*/

export const getAuditLogById = asyncHandler(
  async (req: Request, res: Response) => {
    const audit = await auditLogService.getById(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Audit log fetched successfully.",

      data: audit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get User Audit Logs
|--------------------------------------------------------------------------
*/

export const getUserAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const audits = await auditLogService.getByUser(req.params.userId as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "User audit logs fetched successfully.",

      data: audits,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Module Audit Logs
|--------------------------------------------------------------------------
*/

export const getModuleAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const audits = await auditLogService.getByModule(req.params.module as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Module audit logs fetched successfully.",

      data: audits,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Audit Logs
|--------------------------------------------------------------------------
*/

export const getAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const audits = await auditLogService.getAll(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Audit logs fetched successfully.",

      data: audits,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await auditLogService.dashboard(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Audit dashboard fetched successfully.",

    data: dashboard,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const statistics = await auditLogService.statistics(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Audit statistics fetched successfully.",

    data: statistics,
  });
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const softDeleteAuditLog = asyncHandler(
  async (req: Request, res: Response) => {
    const audit = await auditLogService.softDelete(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Audit log deleted successfully.",

      data: audit,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreAuditLog = asyncHandler(
  async (req: Request, res: Response) => {
    const audit = await auditLogService.restore(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Audit log restored successfully.",

      data: audit,
    });
  },
);
