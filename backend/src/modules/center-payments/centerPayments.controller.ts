import { Request, Response } from "express";
import centerPaymentsService from "./centerPayments.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const getCenterPayments = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;
  // Use centerId from the user object (if Center Manager) or query param (if Admin)
  const centerId = user?.centerId || req.query.centerId;

  if (!centerId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Center ID is required",
    });
  }

  const payments = await centerPaymentsService.getCenterPayments(centerId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Center payments fetched successfully",
    data: payments,
  });
});
