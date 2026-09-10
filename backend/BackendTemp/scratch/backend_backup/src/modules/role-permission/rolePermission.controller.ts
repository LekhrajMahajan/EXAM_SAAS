import { Request, Response } from "express";

import rolePermissionService from "./rolePermission.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Assign Permissions
|--------------------------------------------------------------------------
*/

export const assignPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const permIds = req.body.permissionIds || req.body.permissions || [];

    const result = await rolePermissionService.assignPermissions(
      id as string,
      permIds as string[],
      (req as any).user,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permissions assigned successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Patch Permissions (Granular update alias for assign/replace)
|--------------------------------------------------------------------------
*/

export const patchPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const permIds = req.body.permissionIds || req.body.permissions || [];

    const result = await rolePermissionService.assignPermissions(
      id as string,
      permIds as string[],
      (req as any).user,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permissions updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Role Permissions
|--------------------------------------------------------------------------
*/

export const getRolePermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await rolePermissionService.getPermissions(id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Role permissions fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Permission Matrix (2D View for UI)
|--------------------------------------------------------------------------
*/

export const getPermissionMatrix = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.query.companyId as string | undefined;

    const result = await rolePermissionService.getPermissionMatrix(
      companyId,
      (req as any).user,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission matrix fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Replace Permissions
|--------------------------------------------------------------------------
*/

export const replacePermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const permIds = req.body.permissionIds || req.body.permissions || [];

    const result = await rolePermissionService.replacePermissions(
      id as string,
      permIds as string[],
      (req as any).user,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permissions replaced successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Remove Single Permission
|--------------------------------------------------------------------------
*/

export const removePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, permissionId } = req.params;

    const result = await rolePermissionService.removePermission(
      id as string,
      permissionId as string,
      (req as any).user,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission removed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Clear All Permissions
|--------------------------------------------------------------------------
*/

export const clearPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await rolePermissionService.clearPermissions(
      id as string,
      (req as any).user,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "All permissions removed successfully.",
      data: result,
    });
  },
);
