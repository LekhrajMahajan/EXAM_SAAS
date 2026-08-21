import { Request, Response } from "express";

import roomService from "./room.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Room
|--------------------------------------------------------------------------
*/

export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const result = await roomService.create(req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Room created successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Rooms
|--------------------------------------------------------------------------
*/

export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  const result = await roomService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: req.query.companyId as string,
    centerId: req.query.centerId as string,
    building: req.query.building as string,
    floor: req.query.floor ? Number(req.query.floor) : undefined,
    roomType: req.query.roomType as string,
    status: req.query.status as string,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Rooms fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Room By Id
|--------------------------------------------------------------------------
*/

export const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const result = await roomService.getById(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Room fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Room
|--------------------------------------------------------------------------
*/

export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const result = await roomService.update(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Room updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Room Status
|--------------------------------------------------------------------------
*/

export const updateRoomStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await roomService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Room status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Room
|--------------------------------------------------------------------------
*/

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const result = await roomService.delete(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Room deleted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Restore Room
|--------------------------------------------------------------------------
*/

export const restoreRoom = asyncHandler(async (req: Request, res: Response) => {
  const result = await roomService.restore(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Room restored successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Room Statistics
|--------------------------------------------------------------------------
*/

export const getRoomStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await roomService.statistics(req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Room statistics fetched successfully.",
      data: result,
    });
  },
);
