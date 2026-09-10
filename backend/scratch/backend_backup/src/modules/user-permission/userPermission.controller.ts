import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import userPermissionService from "./userPermission.service";
import { HTTP_STATUS } from "../../constants/httpStatus";

export class UserPermissionController {
  /**
   * POST /api/v1/users/:id/permissions
   * Grant, Deny, Temporary, or Bulk Permission Overrides for a user
   */
  public assignPermissions = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = req.params.id || req.params.userId;
    const actor = (req as any).user;
    const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "0.0.0.0";
    const userAgent = req.headers["user-agent"] || "Unknown Browser";

    const result = await userPermissionService.assignOverride(
      targetUserId as string,
      req.body,
      actor,
      { ip, userAgent }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: result.message,
    });
  });

  /**
   * GET /api/v1/users/:id/permissions
   * Get all direct permission overrides for a user
   */
  public getPermissions = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = req.params.id || req.params.userId;
    const actor = (req as any).user;
    const companyId = req.query.companyId?.toString() || actor?.companyId?.toString() || null;

    const data = await userPermissionService.getUserOverrides(targetUserId as string, companyId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  });

  /**
   * PATCH /api/v1/users/:id/permissions
   * Update existing overrides (e.g. extending expiry, toggling grant/deny, editing reason)
   */
  public updatePermissions = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = req.params.id || req.params.userId;
    const actor = (req as any).user;
    const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "0.0.0.0";
    const userAgent = req.headers["user-agent"] || "Unknown Browser";

    const result = await userPermissionService.assignOverride(
      targetUserId as string,
      req.body,
      actor,
      { ip, userAgent }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "User permission overrides updated successfully.",
    });
  });

  /**
   * DELETE /api/v1/users/:id/permissions
   * Revoke single or bulk overrides, reverting user access back to inherited role default
   */
  public revokePermissions = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = req.params.id || req.params.userId;
    const actor = (req as any).user;
    const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "0.0.0.0";
    const userAgent = req.headers["user-agent"] || "Unknown Browser";

    const permissionIds: string[] = req.body.permissionIds || (req.query.permissionId ? [req.query.permissionId as string] : []);
    const reason = req.body.reason || req.query.reason?.toString() || "Revoked administrative override";
    const companyId = req.query.companyId?.toString() || actor?.companyId?.toString() || null;

    const result = await userPermissionService.revokeOverrides(
      targetUserId as string,
      permissionIds,
      actor,
      { ip, userAgent, reason },
      companyId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: result.message,
    });
  });

  /**
   * GET /api/v1/users/:id/effective-permissions
   * Return complete Difference View resolution matrix with highlighters (Inherited, Granted, Denied, Temporary)
   */
  public getEffectivePermissions = asyncHandler(async (req: Request, res: Response) => {
    const targetUserId = req.params.id || req.params.userId;
    const actor = (req as any).user;

    const data = await userPermissionService.getEffectivePermissions(targetUserId as string, actor);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  });
}

export default new UserPermissionController();
