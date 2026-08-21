import roomRepository from "../room/room.repository";
import seatRepository from "./seat.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ISeat, SeatStatus, SeatType } from "./seat.types";
import { BaseService } from "../../common/base.service";

class SeatService extends BaseService<ISeat> {
  constructor() {
    super(seatRepository, "Seat");
  }

  /*
  |--------------------------------------------------------------------------
  | Create Seat
  |--------------------------------------------------------------------------
  */
  async create(payload: Partial<ISeat>) {
    const room = await roomRepository.findById(payload.roomId!.toString());

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Room not found.");
    }

    const existingSeat = await seatRepository.findBySeatNumber(
      payload.roomId!.toString(),
      payload.seatNumber!,
    );

    if (existingSeat) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Seat number already exists.");
    }

    const existingPosition = await seatRepository.findByPosition(
      payload.roomId!.toString(),
      payload.row!,
      payload.column!,
    );

    if (existingPosition) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Seat position already exists.");
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Generate Seats Automatically
  |--------------------------------------------------------------------------
  */
  async generateSeats(roomId: string, rows: number, columns: number) {
    const room = await roomRepository.findById(roomId);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Room not found.");
    }

    const existingSeats = await seatRepository.findByRoom(roomId);

    if (existingSeats.length > 0) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Seats already generated for this room.",
      );
    }

    const seats: Partial<ISeat>[] = [];

    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + r);

      for (let c = 1; c <= columns; c++) {
        seats.push({
          companyId: room.companyId._id,
          centerId: room.centerId._id,
          roomId: room._id,

          seatNumber: `${rowLetter}-${String(c).padStart(2, "0")}`,

          row: rowLetter,

          column: c,

          seatType: SeatType.NORMAL,

          status: SeatStatus.AVAILABLE,

          isBlocked: false,
        });
      }
    }

    return await seatRepository.createMany(seats);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Seats
  |--------------------------------------------------------------------------
  */
  async getAll(query: any) {
    if (typeof query.isBlocked === "string") {
      query.isBlocked = query.isBlocked === "true";
    }
    const result = await super.getAll(query);
    return {
      seats: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Block Seat
  |--------------------------------------------------------------------------
  */
  async blockSeat(id: string, remarks?: string) {
    const seat = await seatRepository.findById(id);

    if (!seat) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Seat not found.");
    }

    if (seat.isBlocked) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Seat is already blocked.");
    }

    return await seatRepository.blockSeat(id, remarks);
  }

  /*
  |--------------------------------------------------------------------------
  | Unblock Seat
  |--------------------------------------------------------------------------
  */
  async unblockSeat(id: string) {
    const seat = await seatRepository.findById(id);

    if (!seat) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Seat not found.");
    }

    return await seatRepository.unblockSeat(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */
  async statistics(roomId?: string) {
    const totalSeats = await seatRepository.count(roomId ? { roomId } : undefined);

    const availableSeats = roomId
      ? await seatRepository.countAvailable(roomId)
      : 0;

    return {
      totalSeats,
      availableSeats,
    };
  }
}

export default new SeatService();
