import { Request, Response } from "express";

import seatService from "./seat.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Seat
|--------------------------------------------------------------------------
*/

export const createSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.create(req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Seat created successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Generate Seats
|--------------------------------------------------------------------------
*/

export const generateSeats = asyncHandler(
  async (req: Request, res: Response) => {
    const { roomId, rows, columns } = req.body;

    const result = await seatService.generateSeats(roomId, rows, columns);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Seats generated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Seats
|--------------------------------------------------------------------------
*/

export const getSeats = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: req.query.companyId as string,
    centerId: req.query.centerId as string,
    roomId: req.query.roomId as string,

    row: req.query.row as string,
    seatType: req.query.seatType as string,
    status: req.query.status as string,
    isBlocked:
      req.query.isBlocked !== undefined
        ? req.query.isBlocked === "true"
        : undefined,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seats fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Seat By Id
|--------------------------------------------------------------------------
*/

export const getSeatById = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.getById(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Seat
|--------------------------------------------------------------------------
*/

export const updateSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.update(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Seat Status
|--------------------------------------------------------------------------
*/

export const updateSeatStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await seatService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Seat status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Block Seat
|--------------------------------------------------------------------------
*/

export const blockSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.blockSeat(
    req.params.id as string,
    req.body.remarks,
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat blocked successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Unblock Seat
|--------------------------------------------------------------------------
*/

export const unblockSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.unblockSeat(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat unblocked successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Seat
|--------------------------------------------------------------------------
*/

export const deleteSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.delete(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat deleted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Restore Seat
|--------------------------------------------------------------------------
*/

export const restoreSeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await seatService.restore(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Seat restored successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Seat Statistics
|--------------------------------------------------------------------------
*/

export const getSeatStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await seatService.statistics(req.query.roomId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Seat statistics fetched successfully.",
      data: result,
    });
  },
);
