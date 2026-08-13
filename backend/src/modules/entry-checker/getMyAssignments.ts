import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import mongoose from "mongoose";

export const getMyAssignments = asyncHandler(async (req: Request, res: Response) => {
  const centerId = (req.user as any)?.centerId;
  const staffId = (req.user as any)?.id || (req.user as any)?._id || (req.user as any)?.roleId;
  
  if (!centerId || !staffId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Missing centerId or staffId in user token",
    });
  }

  if (!mongoose.connection.db) {
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      success: false,
      message: "Database connection not established",
    });
  }

  const CenterAssignExamStaff = mongoose.connection.db.collection('centerassignexamstaffs');
  
  // Find all assignments for this center where this staff is assigned
  const assignments = await CenterAssignExamStaff.find({
    centerId: new mongoose.Types.ObjectId(centerId),
    "assignments.staffId": new mongoose.Types.ObjectId(staffId)
  }).toArray();

  const examNames = assignments.map((a: any) => a.examName).filter(Boolean);
  // Get unique exam names
  const uniqueExamNames = [...new Set(examNames)];

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assignments fetched successfully",
    data: {
      examNames: uniqueExamNames
    }
  });
});
