import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import organizationSeederService from "./organizationSeeder.service";
import { HTTP_STATUS } from "../../constants/httpStatus";

type AuthenticatedRequest = Request & { user?: any };

/**
 * Reseed system-wide defaults or master catalogs
 * POST /system/reseed
 */
export const reseedSystem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const actorId = req.user?._id?.toString() || "system";
  const result = await organizationSeederService.reseedSystem(actorId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "System defaults and tenant organizations reseeded successfully.",
    data: result,
  });
});

/**
 * Initialize a specific company tenant
 * POST /company/:id/initialize
 */
export const initializeCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = String(req.params.id);
  const actorId = req.user?._id?.toString() || "system";
  const result = await organizationSeederService.initializeOrganization(id, actorId, true);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
    data: result.data,
  });
});

/**
 * Check initialization status of a company tenant
 * GET /company/:id/initialization-status
 */
export const getInitializationStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const status = await organizationSeederService.getStatus(id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: status,
  });
});

/**
 * Rebuild navigation sidebar tree for a company tenant
 * POST /company/:id/rebuild-sidebar
 */
export const rebuildSidebar = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const result = await organizationSeederService.rebuildSidebar(id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
    data: { menu: result.menu },
  });
});

/**
 * Rebuild role permissions matrix for a company tenant
 * POST /company/:id/rebuild-permissions
 */
export const rebuildPermissions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = String(req.params.id);
  const actorId = req.user?._id?.toString() || "system";
  const result = await organizationSeederService.rebuildPermissions(id, actorId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
  });
});
