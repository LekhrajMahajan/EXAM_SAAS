import { Request, Response } from "express";

import examRoomService from "./examRoom.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Exam Room
|--------------------------------------------------------------------------
*/

export const createExamRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Exam room allocated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Exam Rooms
|--------------------------------------------------------------------------
*/

export const getExamRooms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.getAll({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 10,

      search: req.query.search as string,

      examId: req.query.examId as string,

      shiftId: req.query.shiftId as string,

      centerId: req.query.centerId as string,

      roomId: req.query.roomId as string,

      status: req.query.status as any,
    });

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam rooms fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Exam Room By Id
|--------------------------------------------------------------------------
*/

export const getExamRoomById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam room fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Rooms By Exam Center
|--------------------------------------------------------------------------
*/

export const getExamRoomsByCenter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.getByCenter(
      req.params.centerId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam center rooms fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Rooms By Shift
|--------------------------------------------------------------------------
*/

export const getExamRoomsByShift = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.getByShift(
      req.params.shiftId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam shift rooms fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Exam Room
|--------------------------------------------------------------------------
*/

export const updateExamRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam room updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateExamRoomStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam room status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Exam Room
|--------------------------------------------------------------------------
*/

export const deleteExamRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam room deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Exam Room
|--------------------------------------------------------------------------
*/

export const restoreExamRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam room restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getExamRoomStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examRoomService.statistics(
      req.query.centerId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam room statistics fetched successfully.",
      data: result,
    });
  },
);
