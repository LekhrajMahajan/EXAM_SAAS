import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import integrationService from "./integration.service";
import { IntegrationCategory, IntegrationEnvironment } from "./integration.types";

export const getIntegrations = asyncHandler(async (req: Request, res: Response) => {
  const { category, environment, page, limit, search } = req.query;
  
  const filters: any = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: search as string,
  };
  if (category) filters.category = category;
  if (environment) filters.environment = environment;

  const result = await integrationService.getAll(filters);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Integrations fetched successfully",
    data: result,
  });
});

export const getIntegration = asyncHandler(async (req: Request, res: Response) => {
  const integration = await integrationService.getById(req.params.id as string);
  
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Integration fetched successfully",
    data: integration,
  });
});

export const createIntegration = asyncHandler(async (req: Request, res: Response) => {
  const integration = await integrationService.createIntegration(req.body, req.user!.userId as string);
  
  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Integration created successfully",
    data: integration,
  });
});

export const updateIntegration = asyncHandler(async (req: Request, res: Response) => {
  const integration = await integrationService.updateIntegration(req.params.id as string, req.body, req.user!.userId as string);
  
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Integration updated successfully",
    data: integration,
  });
});

export const deleteIntegration = asyncHandler(async (req: Request, res: Response) => {
  await integrationService.delete(req.params.id as string);
  
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Integration deleted successfully",
  });
});

export const testIntegration = asyncHandler(async (req: Request, res: Response) => {
  const result = await integrationService.testConnection(req.params.id as string, req.user!.userId as string);
  
  sendResponse(res, httpStatus.OK, {
    success: true,
    message: result.success ? "Integration test successful" : "Integration test failed",
    data: result,
  });
});
