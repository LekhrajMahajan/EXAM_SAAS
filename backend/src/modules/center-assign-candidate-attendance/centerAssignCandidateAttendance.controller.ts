import { Request, Response } from "express";
import centerAssignCandidateAttendanceService from "./centerAssignCandidateAttendance.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const getAllocatedExams = asyncHandler(async (req: Request, res: Response) => {
  const { centerId, examId } = req.query;
  const filter: any = { isDeleted: false };
  if (centerId) filter.centerId = centerId;
  if (examId) filter.examId = examId;

  const allocations = await centerAssignCandidateAttendanceService.getAllocatedExams(filter);

  // Map the response to easily use it in the frontend (extracting examId)
  const formattedExams = allocations.map(a => a.examId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Allocated exams fetched successfully",
    data: formattedExams,
  });
});

export const allocateExam = asyncHandler(async (req: Request, res: Response) => {
  const { centerId, examId } = req.body;
  const user = req.user as any;
  const companyId = user?.companyId;
  const allocatedBy = user?._id || user?.id;

  const allocation = await centerAssignCandidateAttendanceService.allocateExam({
    companyId,
    centerId,
    examId,
    allocatedBy,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam allocated to center successfully",
    data: allocation,
  });
});

export const removeAllocation = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  const allocation = await centerAssignCandidateAttendanceService.removeAllocation(id);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Allocation removed successfully",
    data: allocation,
  });
});
