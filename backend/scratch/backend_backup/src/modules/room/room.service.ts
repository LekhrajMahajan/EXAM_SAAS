import roomRepository from "./room.repository";
import companyRepository from "../company/company.repository";
import centerRepository from "../center/center.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { IRoom } from "./room.types";
import { BaseService } from "../../common/base.service";

class RoomService extends BaseService<IRoom> {
  constructor() {
    super(roomRepository, "Room");
  }

  /*
  |--------------------------------------------------------------------------
  | Create Room
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IRoom>) {
    const company = await companyRepository.findById(
      payload.companyId!.toString(),
    );

    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found.");
    }

    const center = await centerRepository.findById(
      payload.centerId!.toString(),
    );

    if (!center) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Center not found.");
    }

    if (center.companyId._id.toString() !== payload.companyId!.toString()) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Center does not belong to the selected company.",
      );
    }

    const existingCode = await roomRepository.findByRoomCode(
      payload.companyId!.toString(),
      payload.centerId!.toString(),
      payload.roomCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Room code already exists.");
    }

    const existingName = await roomRepository.findByRoomName(
      payload.companyId!.toString(),
      payload.centerId!.toString(),
      payload.roomName!,
    );

    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Room name already exists.");
    }

    if (payload.availableSeats! > payload.capacity!) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Available seats cannot exceed room capacity.",
      );
    }

    if (payload.rows! * payload.columns! < payload.capacity!) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Rows × Columns must be greater than or equal to capacity.",
      );
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Rooms
  |--------------------------------------------------------------------------
  */

  async getAll(query: any) {
    query.searchFields = ["roomCode", "roomName", "building"];
    const result = await super.getAll(query);
    return {
      rooms: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Room
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IRoom>) {
    const room = await roomRepository.findById(id);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Room not found.");
    }

    if (payload.roomCode && payload.roomCode !== room.roomCode) {
      const existingCode = await roomRepository.findByRoomCode(
        room.companyId._id.toString(),
        room.centerId._id.toString(),
        payload.roomCode,
      );

      if (existingCode && existingCode.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Room code already exists.");
      }
    }

    if (payload.roomName && payload.roomName !== room.roomName) {
      const existingName = await roomRepository.findByRoomName(
        room.companyId._id.toString(),
        room.centerId._id.toString(),
        payload.roomName,
      );

      if (existingName && existingName.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Room name already exists.");
      }
    }

    const capacity = payload.capacity ?? room.capacity;
    const availableSeats = payload.availableSeats ?? room.availableSeats;
    const rows = payload.rows ?? room.rows;
    const columns = payload.columns ?? room.columns;

    if (availableSeats > capacity) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Available seats cannot exceed room capacity.",
      );
    }

    if (rows * columns < capacity) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Rows × Columns must be greater than or equal to capacity.",
      );
    }

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    const totalRooms = await roomRepository.count(companyId ? { companyId } : undefined);

    return {
      totalRooms,
    };
  }
}

export default new RoomService();
