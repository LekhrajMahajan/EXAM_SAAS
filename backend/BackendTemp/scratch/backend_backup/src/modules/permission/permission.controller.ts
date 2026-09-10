import { Request, Response } from "express";

import permissionService from "./permission.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Permission
|--------------------------------------------------------------------------
*/

export const createPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const authUserId = (req as any).user?._id?.toString();
    const result = await permissionService.create(req.body, undefined, authUserId);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Permission created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Permissions / Search
|--------------------------------------------------------------------------
*/

export const getPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await permissionService.search({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 50,
      search: req.query.search as string,
      keyword: req.query.keyword as string,
      companyId: req.query.companyId as string,
      module: req.query.module as string,
      group: req.query.group as string,
      action: req.query.action as string,
      resource: req.query.resource as string,
      category: req.query.category as string,
      status: req.query.status as string,
      isSystem:
        req.query.isSystem === undefined
          ? undefined
          : req.query.isSystem === "true",
      isSystemPermission:
        req.query.isSystemPermission === undefined
          ? undefined
          : req.query.isSystemPermission === "true",
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permissions fetched successfully.",
      data: result.data,
      pagination: result.pagination,
    } as any);
  },
);

/*
|--------------------------------------------------------------------------
| Search Permissions (dedicated /search route)
|--------------------------------------------------------------------------
*/

export const searchPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await permissionService.search(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permissions search results fetched successfully.",
      data: result.data,
      pagination: result.pagination,
    } as any);
  },
);

/*
|--------------------------------------------------------------------------
| Get Permissions By Group
|--------------------------------------------------------------------------
*/

export const getPermissionsByGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const group = req.params.group as string;
    const result = await permissionService.getByGroup(group, req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: `Permissions for group "${group}" fetched successfully.`,
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Permissions By Module
|--------------------------------------------------------------------------
*/

export const getPermissionsByModule = asyncHandler(
  async (req: Request, res: Response) => {
    const moduleName = req.params.module as string;
    const result = await permissionService.getByModule(moduleName, req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: `Permissions for module "${moduleName}" fetched successfully.`,
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Permission By Id
|--------------------------------------------------------------------------
*/

export const getPermissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await permissionService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Permission
|--------------------------------------------------------------------------
*/

export const updatePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const authUserId = (req as any).user?._id?.toString();
    const result = await permissionService.update(
      req.params.id as string,
      req.body,
      undefined,
      undefined,
      authUserId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updatePermissionStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const authUserId = (req as any).user?._id?.toString();
    const result = await permissionService.updateStatus(
      req.params.id as string,
      req.body.status,
      undefined,
      undefined,
      authUserId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Permission
|--------------------------------------------------------------------------
*/

export const deletePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const authUserId = (req as any).user?._id?.toString();
    const result = await permissionService.delete(req.params.id as string, undefined, authUserId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Permission
|--------------------------------------------------------------------------
*/

export const restorePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const authUserId = (req as any).user?._id?.toString();
    const result = await permissionService.restore(req.params.id as string, undefined, authUserId);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getPermissionStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await permissionService.statistics(
      req.query.companyId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Permission statistics fetched successfully.",
      data: result,
    });
  },
);
