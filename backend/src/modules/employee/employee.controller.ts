import { Request, Response } from "express";
import mongoose from "mongoose";

import employeeService from "./employee.service";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction } from "../audit-log/auditLog.types";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Employee
|--------------------------------------------------------------------------
*/

export const createEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.body.companyId && (req as any).user?.companyId) {
      req.body.companyId = (req as any).user.companyId;
    }

    if (!req.body.companyId) {
      throw new (require("../../utils/ApiError").default)(
        require("../../constants/httpStatus").HTTP_STATUS.BAD_REQUEST, 
        "Company ID is required to create a staff role. Please provide it in the payload or ensure you are logged in as a Company Admin."
      );
    }
    
    const result = await employeeService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Employee created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Employees
|--------------------------------------------------------------------------
*/

export const getEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    const extraQuery: Record<string, any> = {};
    if (req.query.role) {
      extraQuery.role = req.query.role;
    }
    if (req.query.date) {
      const startOfDay = new Date(req.query.date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.query.date as string);
      endOfDay.setHours(23, 59, 59, 999);

      extraQuery.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (req.query.department) {
      extraQuery.department = {
        $regex: req.query.department as string,
        $options: "i",
      };
    }

    const result = await employeeService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      searchFields: [
        "firstName",
        "lastName",
        "email",
        "employeeCode",
      ],
      companyId: (req.query.companyId as string) || (req as any).user?.companyId,
      designation: req.query.designation as string,
      status: req.query.status as string,
      extraQuery,
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employees fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Employee By Id
|--------------------------------------------------------------------------
*/

export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
*/

export const updateEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await (employeeService as any).update(
      req.params.id as string,
      req.body,
      [],
      undefined,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Employee
|--------------------------------------------------------------------------
*/

export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Employee
|--------------------------------------------------------------------------
*/

export const restoreEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.restore(
      req.params.id as string,
      undefined,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Employee Status
|--------------------------------------------------------------------------
*/

export const updateEmployeeStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.updateStatus(
      req.params.id as string,
      req.body.status,
      undefined,
      undefined,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Reset Employee Password
|--------------------------------------------------------------------------
*/

export const resetEmployeePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.resetPassword(
      req.params.id as string,
      req.body.newPassword,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee password reset successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Assign Employee Role
|--------------------------------------------------------------------------
*/

export const assignEmployeeRole = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.assignRole(
      req.params.id as string,
      req.body.roleId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee role assigned successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Employee Statistics
|--------------------------------------------------------------------------
*/

export const getEmployeeStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.statistics(
      req.query.companyId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Employee Login History
|--------------------------------------------------------------------------
*/

export const getEmployeeLoginHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const employee = await employeeService.getById(id as string);
    if (!employee) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
        success: false,
        message: "Employee not found",
      });
    }

    const authUserId =
      typeof employee.userId === "object" && "_id" in (employee.userId as any)
        ? (employee.userId as any)._id
        : employee.userId;

    const queryId = authUserId ? authUserId.toString() : id;

    const extraQuery: Record<string, any> = {
      performedBy: new mongoose.Types.ObjectId(queryId),
      action: { $in: [AuditAction.LOGIN, AuditAction.LOGOUT] },
    };

    if (req.query.status) extraQuery.status = req.query.status;
    if (req.query.browser) extraQuery.browser = req.query.browser;
    if (req.query.deviceType) extraQuery.deviceType = req.query.deviceType;
    if (req.query.operatingSystem)
      extraQuery.operatingSystem = req.query.operatingSystem;

    if (req.query.startDate && req.query.endDate) {
      extraQuery.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    const result = await auditLogService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      searchFields: ["ipAddress", "deviceType", "browser", "operatingSystem"],
      extraQuery,
      sort: { createdAt: -1 },
    });

    // Log that timeline was viewed
    await auditLogService.createActionLog(
      "Employee",
      AuditAction.READ,
      `Viewed login history for user ${id}`,
      (req as any).user?.userId,
      { targetUserId: id },
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Login history retrieved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Employee Activity
|--------------------------------------------------------------------------
*/

export const getEmployeeActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const employee = await employeeService.getById(id as string);
    if (!employee) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
        success: false,
        message: "Employee not found",
      });
    }

    const authUserId =
      typeof employee.userId === "object" && "_id" in (employee.userId as any)
        ? (employee.userId as any)._id
        : employee.userId;

    const queryId = authUserId ? authUserId.toString() : id;

    const extraQuery: Record<string, any> = {
      performedBy: new mongoose.Types.ObjectId(queryId),
    };

    if (req.query.action) {
      extraQuery.action = req.query.action;
    }

    if (req.query.startDate && req.query.endDate) {
      extraQuery.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    const result = await auditLogService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      searchFields: ["action", "module", "description", "ipAddress"],
      extraQuery,
      sort: { createdAt: -1 },
    });

    // Log that timeline was viewed
    await auditLogService.createActionLog(
      "Employee",
      AuditAction.READ,
      `Viewed activity timeline for user ${id}`,
      (req as any).user?.userId,
      { targetUserId: id },
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "User activity retrieved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Invite Employee (Automated Onboarding Workflow)
|--------------------------------------------------------------------------
*/

export const inviteEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.invite(
      req.body,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Employee invited successfully. Onboarding credentials dispatched.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Complete Profile & Onboarding
|--------------------------------------------------------------------------
*/

export const completeProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const result = await employeeService.completeProfile(
      targetId as string,
      req.body,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee profile details completed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Upload Documents (With Versioning)
|--------------------------------------------------------------------------
*/

export const uploadDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const documents = req.body.documents || (Array.isArray(req.body) ? req.body : [req.body]);
    const result = await employeeService.uploadDocuments(
      targetId as string,
      documents,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee verification documents uploaded successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Face Biometric Enrollment & Quality Verification
|--------------------------------------------------------------------------
*/

export const faceEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const result = await employeeService.faceEnrollment(
      targetId as string,
      req.body,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face biometric data enrolled successfully and checked against duplicates.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Submit For Statutory Admin Verification
|--------------------------------------------------------------------------
*/

export const submitVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const result = await employeeService.submitVerification(
      targetId as string,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Verification submitted to Administration for review.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Admin Review - Approve Verification & Unlock Role Dashboard
|--------------------------------------------------------------------------
*/

export const approveVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = (req as any).user?.companyId || req.body.companyId || "";
    const targetIds = req.body.employeeIds || req.body.employeeId || req.params.id;
    const result = await employeeService.approveVerification(
      companyId as string,
      targetIds,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee verification approved. Role operational dashboard is now unlocked.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Admin Review - Reject Verification & Send Correction Instructions
|--------------------------------------------------------------------------
*/

export const rejectVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = (req as any).user?.companyId || req.body.companyId || "";
    const targetId = req.params.id || req.body.employeeId;
    const result = await employeeService.rejectVerification(
      companyId as string,
      targetId as string,
      req.body.reason,
      req.body.correctionNotes,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee verification rejected with correction instructions.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Get Employee Dashboard & Verification Unlock Status
|--------------------------------------------------------------------------
*/

export const getEmployeeDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const result = await employeeService.getDashboard(targetId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee dashboard setup fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Transfer Employee (Branch / Center Facility)
|--------------------------------------------------------------------------
*/

export const transferEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.transfer(
      req.params.id as string,
      req.body,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee facility transfer executed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Device & Security Session Tracking
|--------------------------------------------------------------------------
*/

export const getEmployeeDevices = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const result = await employeeService.getDevices(targetId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee active device sessions fetched successfully.",
      data: result,
    });
  },
);

export const logoutEmployeeDevices = asyncHandler(
  async (req: Request, res: Response) => {
    const targetId = req.params.id || (req as any).user?.userId;
    const result = await employeeService.logoutAllDevices(
      targetId as string,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "All employee device sessions terminated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Bulk Operation (Verify / Suspend / Activate / Archive / Reset)
|--------------------------------------------------------------------------
*/

export const bulkEmployeeOperation = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await employeeService.bulkOperation(
      req.body.action,
      req.body.employeeIds,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: `Bulk operation ${req.body.action} executed successfully.`,
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Phase 5.4: Export Employee Report via Import/Export Engine
|--------------------------------------------------------------------------
*/

export const exportEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    const format = req.query.format || req.body.format || "json";
    const result = await employeeService.exportEmployees(
      req.query,
      format as any,
      (req as any).user?.userId,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Employee data export initiated successfully.",
      data: result,
    });
  },
);

