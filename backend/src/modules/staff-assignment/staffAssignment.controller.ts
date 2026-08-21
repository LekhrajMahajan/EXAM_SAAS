import { Request, Response } from "express";
import staffAssignmentService from "./staffAssignment.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { AssignmentStatus } from "./staffAssignment.types";

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || req.body.companyId;
  const userId = (req as any).user?._id || req.body.createdBy;
  const result = await staffAssignmentService.createAssignment({ ...req.body, companyId }, userId);
  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Staff assigned successfully.",
    data: result,
  });
});

export const autoAssign = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || req.body.companyId;
  const userId = (req as any).user?._id || req.body.createdBy;
  const result = await staffAssignmentService.autoAssign({ ...req.body, companyId, createdBy: userId });
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Auto assignment engine executed successfully.",
    data: result,
  });
});

export const bulkAssign = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || req.body.companyId;
  const userId = (req as any).user?._id || req.body.createdBy;
  const result = await staffAssignmentService.bulkAssign({
    companyId,
    assignments: req.body.assignments || [],
    createdBy: userId,
  });
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Bulk assignment processed.",
    data: result,
  });
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || (req.query.companyId as string);
  const result = await staffAssignmentService.getDashboard(companyId, {
    centerId: req.query.centerId as string,
    employeeId: req.query.employeeId as string,
  });
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment dashboard data retrieved.",
    data: result,
  });
});

export const getCalendar = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || (req.query.companyId as string);
  const result = await staffAssignmentService.getCalendar(companyId, req.query);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assignment calendar events loaded.",
    data: result,
  });
});

export const getConflicts = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || (req.query.companyId as string);
  const result = await staffAssignmentService.getConflictsList(companyId, req.query);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Conflict alerts retrieved.",
    data: result,
  });
});

export const getWorkload = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || (req.query.companyId as string);
  const result = await staffAssignmentService.getWorkload(companyId, req.query);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Employee workload report generated.",
    data: result,
  });
});

export const exportAssignments = asyncHandler(async (req: Request, res: Response) => {
  const companyId = (req as any).user?.companyId || (req.query.companyId as string);
  const result = await staffAssignmentService.exportAssignmentsData(companyId, req.query);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assignments export data generated.",
    data: result,
  });
});

import Employee from "../employee/employee.model";

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const companyId = user?.companyId || (req.query.companyId as string);
  const query: any = { ...req.query, companyId };
  
  // Data Isolation Logic
  if (user && !['COMPANY_ADMIN', 'MASTER_ADMIN'].includes(user.role)) {
    const employee = await Employee.findOne({ userId: user._id });
    if (employee) {
      query.employeeId = employee._id.toString();
    }
  }

  const result = await staffAssignmentService.getAll(query);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignments retrieved successfully.",
    data: result,
  });
});

export const getAssignmentById = asyncHandler(async (req: Request, res: Response) => {
  const result = await staffAssignmentService.getById(req.params.id as string);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment details retrieved.",
    data: result,
  });
});

export const updateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  
  if (req.body.status) {
    const userId = (req as any).user?._id;
    const result = await staffAssignmentService.updateAssignmentStatus(id, req.body.status, userId);
    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Staff assignment status updated successfully.",
      data: result,
    });
  }

  const result = await staffAssignmentService.update(id, req.body);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment updated successfully.",
    data: result,
  });
});

export const approveAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  const userId = (req as any).user?._id;
  const result = await staffAssignmentService.updateAssignmentStatus(id, AssignmentStatus.APPROVED, userId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment approved and attendance prepared.",
    data: result,
  });
});

export const publishAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  const userId = (req as any).user?._id;
  const result = await staffAssignmentService.updateAssignmentStatus(id, AssignmentStatus.PUBLISHED, userId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment published and notification sent.",
    data: result,
  });
});

export const cancelAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  const userId = (req as any).user?._id;
  const result = await staffAssignmentService.updateAssignmentStatus(id, AssignmentStatus.CANCELLED, userId, req.body.reason);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment cancelled.",
    data: result,
  });
});

export const replaceAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  const userId = (req as any).user?._id;
  const result = await staffAssignmentService.replaceAssignment({
    id,
    replacedByEmployeeId: req.body.replacedByEmployeeId || req.body.newEmployeeId,
    updatedBy: userId,
    reason: req.body.reason || "Replacement requested",
  });
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff replacement processed successfully.",
    data: result,
  });
});

export const acceptDuty = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  const userId = (req as any).user?._id;
  const result = await staffAssignmentService.updateAssignmentStatus(id, AssignmentStatus.ACCEPTED, userId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Duty accepted successfully.",
    data: result,
  });
});

export const rejectDuty = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id || req.body.id || req.body._id;
  const userId = (req as any).user?._id;
  const result = await staffAssignmentService.updateAssignmentStatus(id, AssignmentStatus.REJECTED, userId, req.body.reason || "No reason provided");
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Duty rejected.",
    data: result,
  });
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  await staffAssignmentService.delete(req.params.id as string);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Staff assignment deleted successfully.",
  });
});
