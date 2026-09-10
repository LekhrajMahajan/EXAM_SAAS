import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import importExportService from "./importExport.service";

/*
|--------------------------------------------------------------------------
| Import Data
|--------------------------------------------------------------------------
*/

export const importData = asyncHandler(async (req: Request, res: Response) => {
  const result = await importExportService.importData(
    req.body,

    req.user!.userId as string,
  );

  sendResponse(res, httpStatus.CREATED, {
    success: true,

    message: "Import started successfully.",

    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Export Data
|--------------------------------------------------------------------------
*/

export const exportData = asyncHandler(async (req: Request, res: Response) => {
  const result = await importExportService.exportData(
    req.body,

    req.user!.userId as string,
  );

  sendResponse(res, httpStatus.CREATED, {
    success: true,

    message: "Export started successfully.",

    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Validate Import
|--------------------------------------------------------------------------
*/

export const validateImport = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await importExportService.validateImport(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Import validation completed successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get History
|--------------------------------------------------------------------------
*/

export const getHistory = asyncHandler(async (_req: Request, res: Response) => {
  const history = await importExportService.getHistory();

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Import/Export history fetched successfully.",

    data: history,
  });
});

/*
|--------------------------------------------------------------------------
| Get History By Id
|--------------------------------------------------------------------------
*/

export const getHistoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const history = await importExportService.getHistoryById(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "History fetched successfully.",

      data: history,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Download Export
|--------------------------------------------------------------------------
*/

export const downloadExport = asyncHandler(
  async (req: Request, res: Response) => {
    const file = await importExportService.downloadExport(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Export file fetched successfully.",

      data: file,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Cancel Job
|--------------------------------------------------------------------------
*/

export const cancelJob = asyncHandler(async (req: Request, res: Response) => {
  const result = await importExportService.cancelJob(req.params.id as string);

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Import/Export job cancelled successfully.",

    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Delete History
|--------------------------------------------------------------------------
*/

export const deleteHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await importExportService.deleteHistory(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "History deleted successfully.",

      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Template
|--------------------------------------------------------------------------
*/

export const generateTemplate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await importExportService.generateTemplate(
      req.params.type as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Template generated successfully.",

      data: result,
    });
  },
);
