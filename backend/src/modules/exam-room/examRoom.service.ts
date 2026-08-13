import examRepository from "../exam/exam.repository";
import examShiftRepository from "../exam-shift/examShift.repository";
import examCenterRepository from "../exam-center/examCenter.repository";
import roomRepository from "../room/room.repository";

import examRoomRepository from "./examRoom.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ExamApprovalStatus } from "../exam/exam.types";

import { RoomStatus } from "../room/room.types";

import { ExamRoomStatus, IExamRoom } from "./examRoom.types";

class ExamRoomService {
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExamRoom>) {
    // const exam = await examRepository.findById(payload.examId!.toString());

    // if (!exam) {
    //   throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found.");
    // }

    // if (exam.approvalStatus !== ExamApprovalStatus.PUBLISHED) {
    //   throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Exam is not published.");
    // }

    // const shift = await examShiftRepository.findById(
    //   payload.shiftId!.toString(),
    // );

    // if (!shift) {
    //   throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam shift not found.");
    // }

    // const examCenter = await examCenterRepository.findById(
    //   payload.centerId!.toString(),
    // );

    // if (!examCenter) {
    //   throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    // }

    // const room = await roomRepository.findById(payload.roomId!.toString());

    // if (!room) {
    //   throw new ApiError(HTTP_STATUS.NOT_FOUND, "Room not found.");
    // }

    // if (room.status !== RoomStatus.ACTIVE) {
    //   throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Room is inactive.");
    // }

    const exists = await examRoomRepository.findExisting(
      payload.centerId!.toString(),
      payload.roomId!.toString(),
    );

    if (exists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Room already allocated.");
    }

    return await examRoomRepository.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All
  |--------------------------------------------------------------------------
  */

  async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    examId?: string;
    shiftId?: string;
    centerId?: string;
    roomId?: string;
    status?: ExamRoomStatus;
  }) {
    return await examRoomRepository.findAll(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Id
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    const room = await examRoomRepository.findById(id);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam room not found.");
    }

    return room;
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Center
  |--------------------------------------------------------------------------
  */

  async getByCenter(centerId: string) {
    return await examRoomRepository.findByCenter(centerId);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Shift
  |--------------------------------------------------------------------------
  */

  async getByShift(shiftId: string) {
    return await examRoomRepository.findByShift(shiftId);
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IExamRoom>) {
    const room = await examRoomRepository.findById(id);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam room not found.");
    }

    return await examRoomRepository.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamRoomStatus) {
    const room = await examRoomRepository.findById(id);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam room not found.");
    }

    return await examRoomRepository.updateStatus(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async delete(id: string) {
    const room = await examRoomRepository.findById(id);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam room not found.");
    }

    return await examRoomRepository.softDelete(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(id: string) {
    const room = await examRoomRepository.findById(id);

    if (!room) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam room not found.");
    }

    return await examRoomRepository.restore(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(centerId?: string) {
    const totalRooms = await examRoomRepository.count(centerId);

    const activeRooms = await examRoomRepository.countByStatus(
      ExamRoomStatus.ACTIVE,
      centerId,
    );

    const inactiveRooms = await examRoomRepository.countByStatus(
      ExamRoomStatus.INACTIVE,
      centerId,
    );

    const blockedRooms = await examRoomRepository.countByStatus(
      ExamRoomStatus.BLOCKED,
      centerId,
    );

    return {
      totalRooms,
      activeRooms,
      inactiveRooms,
      blockedRooms,
    };
  }
}

export default new ExamRoomService();
