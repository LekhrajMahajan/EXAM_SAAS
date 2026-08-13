import { Request, Response } from "express";

import mongoose from "mongoose";

import roleService from "./role.service";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction } from "../audit-log/auditLog.types";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.create(req.body);

  const authUserId = (req as any).user?._id?.toString();
  if (authUserId) {
    await auditLogService.logSuccess({
      action: AuditAction.CREATE,
      module: "ROLE",
      entityId: new mongoose.Types.ObjectId((result as any)._id.toString()),
      entityName: "Role",
      description: `Role Created: ${(result as any).name}`,
      performedBy: new mongoose.Types.ObjectId(authUserId),
    });
  }

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Role created successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

export const getRoles = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: req.query.companyId as string,
    status: req.query.status as string,
    isSystem:
      req.query.isSystem === undefined
        ? undefined
        : req.query.isSystem === "true",
    roleType: req.query.roleType as string,
    category: req.query.category as string,
    defaultRole:
      req.query.defaultRole === undefined
        ? undefined
        : req.query.defaultRole === "true",
  });

  const authUserId = (req as any).user?._id?.toString();
  if (authUserId) {
    await auditLogService.logSuccess({
      action: AuditAction.READ,
      module: "ROLE",
      entityName: "Role",
      description: "Role List Viewed",
      performedBy: new mongoose.Types.ObjectId(authUserId),
    });
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Roles fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Role By Id
|--------------------------------------------------------------------------
*/

export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.getById(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Role fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.update(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Role updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Assign Permissions
|--------------------------------------------------------------------------
*/

export const assignPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await roleService.assignPermissions(
      req.params.id as string,
      req.body.permissions,
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
| Update Status
|--------------------------------------------------------------------------
*/

export const updateRoleStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await roleService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    const authUserId = (req as any).user?._id?.toString();
    if (authUserId) {
      await auditLogService.logSuccess({
        action: AuditAction.UPDATE,
        module: "ROLE",
        entityId: new mongoose.Types.ObjectId(req.params.id as string),
        entityName: "Role",
        description: `Role ${req.body.status === 'ACTIVE' ? 'Activated' : 'Deactivated'}`,
        performedBy: new mongoose.Types.ObjectId(authUserId),
      });
    }

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Role status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.delete(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Role deleted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Restore Role
|--------------------------------------------------------------------------
*/

export const restoreRole = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.restore(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Role restored successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getRoleStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await roleService.statistics(req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Role statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Clone Role
|--------------------------------------------------------------------------
*/

export const cloneRole = asyncHandler(async (req: Request, res: Response) => {
  const authUser = (req as any).user;
  const companyId = req.body.companyId || authUser?.companyId;

  const result = await roleService.cloneRole(req.params.id as string, {
    name: req.body.name,
    roleCode: req.body.roleCode || req.body.name?.toUpperCase().replace(/\s+/g, "_"),
    displayName: req.body.displayName || req.body.name,
    description: req.body.description,
    permissionIds: req.body.permissionIds || req.body.permissions,
    companyId: companyId ? companyId.toString() : undefined,
  });

  const authUserId = authUser?._id?.toString();
  if (authUserId) {
    await auditLogService.logSuccess({
      action: AuditAction.CREATE,
      module: "ROLE",
      entityId: new mongoose.Types.ObjectId((result as any)._id.toString()),
      entityName: "Role",
      description: `Role Cloned: ${(result as any).name}`,
      performedBy: new mongoose.Types.ObjectId(authUserId),
    });
  }

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Role cloned successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get System Roles (Phase 4.2)
|--------------------------------------------------------------------------
*/

export const getSystemRoles = asyncHandler(async (req: Request, res: Response) => {
  const result = await roleService.getSystemRoles();
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "System roles fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Custom Roles (Phase 4.2)
|--------------------------------------------------------------------------
*/

export const getCustomRoles = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.query.companyId as string | undefined || (req as any).user?.companyId;
  const result = await roleService.getCustomRoles(companyId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Custom roles fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Company Roles (Phase 4.2)
|--------------------------------------------------------------------------
*/

export const getCompanyRoles = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const result = await roleService.getCompanyRoles(companyId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Company roles fetched successfully.",
    data: result,
  });
});
