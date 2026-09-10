import { Request, Response } from "express";

import examShiftService from "./examShift.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Shift
|--------------------------------------------------------------------------
*/

export const createExamShift = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Exam shift created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Shifts
|--------------------------------------------------------------------------
*/

export const getExamShifts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,

      search: req.query.search as string,

      examId: req.query.examId as string,

      status: req.query.status as any,
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shifts fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Shift By Id
|--------------------------------------------------------------------------
*/

export const getExamShiftById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Shifts By Exam
|--------------------------------------------------------------------------
*/

export const getExamShiftsByExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.getByExam(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shifts fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Shift
|--------------------------------------------------------------------------
*/

export const updateExamShift = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateExamShiftStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Shift
|--------------------------------------------------------------------------
*/

export const deleteExamShift = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Shift
|--------------------------------------------------------------------------
*/

export const restoreExamShift = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getExamShiftStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examShiftService.statistics(
      req.query.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift statistics fetched successfully.",
      data: result,
    });
  },
);
