import { Request, Response } from "express";
import reportTemplateService from "./report-template.service";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportTemplateService.getTemplates(req.query);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Templates retrieved successfully",
    data: result,
  });
});

export const getTemplateById = asyncHandler(async (req: Request, res: Response) => {
  const template = await reportTemplateService.getTemplateById(req.params.id as string);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Template retrieved successfully",
    data: template,
  });
});

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const template = await reportTemplateService.createTemplate(req.body, req.user._id);
  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Template created successfully",
    data: template,
  });
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await reportTemplateService.updateTemplate(req.params.id as string, req.body);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Template updated successfully",
    data: template,
  });
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  await reportTemplateService.deleteTemplate(req.params.id as string);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Template deleted successfully",
    data: null,
  });
});

export const togglePublishStatus = asyncHandler(async (req: Request, res: Response) => {
  const template = await reportTemplateService.togglePublishStatus(req.params.id as string);
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Template status toggled successfully",
    data: template,
  });
});
