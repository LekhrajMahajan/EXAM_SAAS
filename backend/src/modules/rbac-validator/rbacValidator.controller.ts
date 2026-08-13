import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import rbacValidatorService from "./rbacValidator.service";
import { HTTP_STATUS } from "../../constants/httpStatus";

type AuthenticatedRequest = Request & { user?: any };

/**
 * Execute automated RBAC security validation suite and performance benchmarks
 * POST /api/v1/rbac-validator/run
 */
export const runValidation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const companyId = req.body?.companyId || req.user?.companyId || String(req.query?.companyId || "");
  const report = await rbacValidatorService.runValidationTests(companyId || undefined);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: report.summaryMessage,
    data: report,
  });
});

/**
 * Retrieve diagnostic status and architecture summary of current RBAC deployment
 * GET /api/v1/rbac-validator/report
 */
export const getValidationReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const companyId = req.user?.companyId || String(req.query?.companyId || "");
  const report = await rbacValidatorService.runValidationTests(companyId || undefined);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: report,
  });
});
