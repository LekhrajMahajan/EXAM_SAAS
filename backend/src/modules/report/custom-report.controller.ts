import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import customReportService from "./custom-report.service";
import metadataService from "./metadata.service";

export const getCustomReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await customReportService.getAll({
    ...req.query,
    userId: req.user?.userId,
  });

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Custom reports fetched successfully",
    data: reports,
  });
});

export const getCustomReportById = asyncHandler(async (req: Request, res: Response) => {
  const report = await customReportService.getById(req.params.id as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Custom report fetched successfully",
    data: report,
  });
});

export const createCustomReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await customReportService.create({
    ...req.body,
    generatedBy: req.user?.userId as any,
  });

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Custom report created successfully",
    data: report,
  });
});

export const updateCustomReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await customReportService.update(req.params.id as string, req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Custom report updated successfully",
    data: report,
  });
});

export const deleteCustomReport = asyncHandler(async (req: Request, res: Response) => {
  await customReportService.delete(req.params.id as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Custom report deleted successfully",
  });
});

export const executeCustomReport = asyncHandler(async (req: Request, res: Response) => {
  const result = await customReportService.execute(req.params.id as string, req.query);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Custom report executed successfully",
    data: result.data,
    meta: {
      totalRows: result.totalRows,
      pipeline: result.pipeline
    }
  } as any);
});

export const previewCustomReport = asyncHandler(async (req: Request, res: Response) => {
  const result = await customReportService.preview(req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Custom report preview generated successfully",
    data: result.data,
    meta: {
      totalRows: result.totalRows,
      pipeline: result.pipeline
    }
  } as any);
});

export const cloneCustomReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await customReportService.clone(req.params.id as string, req.user?.userId as string);

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Custom report cloned successfully",
    data: report,
  });
});

export const getCustomReportMetadata = asyncHandler(async (req: Request, res: Response) => {
  const metadata = metadataService.getMetadata();

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Report metadata fetched successfully",
    data: metadata,
  });
});
