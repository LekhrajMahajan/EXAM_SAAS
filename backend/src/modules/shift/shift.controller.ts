import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import shiftService from "./shift.service";

/*
|--------------------------------------------------------------------------
| Create Shift
|--------------------------------------------------------------------------
*/
export const createShift = asyncHandler(async (req: Request, res: Response) => {
  const shift = await shiftService.createShift(req);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Shift created successfully",
    data: shift,
  });
});

/*
|--------------------------------------------------------------------------
| Get Shifts
|--------------------------------------------------------------------------
*/
export const getShifts = asyncHandler(async (req: Request, res: Response) => {
  const result = await shiftService.getShifts(req);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Shifts retrieved successfully",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Shift By Id
|--------------------------------------------------------------------------
*/
export const getShiftById = asyncHandler(async (req: Request, res: Response) => {
  const shift = await shiftService.getShiftById(req);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Shift retrieved successfully",
    data: shift,
  });
});

/*
|--------------------------------------------------------------------------
| Update Shift
|--------------------------------------------------------------------------
*/
export const updateShift = asyncHandler(async (req: Request, res: Response) => {
  const shift = await shiftService.updateShift(req);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Shift updated successfully",
    data: shift,
  });
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/
export const updateShiftStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const shift = await shiftService.updateStatus(req);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Shift status updated successfully",
      data: shift,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Shift
|--------------------------------------------------------------------------
*/
export const deleteShift = asyncHandler(async (req: Request, res: Response) => {
  await shiftService.deleteShift(req);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Shift deleted successfully",
  });
});
