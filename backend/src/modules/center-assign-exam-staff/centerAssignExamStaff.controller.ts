import { Request, Response } from "express";
import centerAssignExamStaffService from "./centerAssignExamStaff.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const { centerId, examId } = req.query;
  const filter: any = { isDeleted: false };
  if (centerId) filter.centerId = centerId;
  if (examId) filter.examId = examId;

  const assignments = await centerAssignExamStaffService.getAssignments(filter);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assignments fetched successfully",
    data: assignments,
  });
});

export const createOrUpdateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { centerId, examId, examName, assignments, reportingTime, examStartDate, examEndDate } = req.body;
  const user = req.user as any;
  const companyId = user?.companyId;
  const createdBy = user?._id || user?.id;

  const assignment = await centerAssignExamStaffService.createOrUpdateAssignment({
    companyId,
    centerId,
    examId,
    examName,
    reportingTime,
    examStartDate,
    examEndDate,
    assignments,
    createdBy,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assignments saved successfully",
    data: assignment,
  });
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  const assignment = await centerAssignExamStaffService.deleteAssignment(id);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assignment deleted successfully",
    data: assignment,
  });
});
