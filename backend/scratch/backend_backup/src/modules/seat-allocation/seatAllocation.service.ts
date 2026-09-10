import examRepository from "../exam/exam.repository";
import examShiftRepository from "../exam-shift/examShift.repository";
import examCenterRepository from "../exam-center/examCenter.repository";
import examRoomRepository from "../exam-room/examRoom.repository";
import seatRepository from "../seat/seat.repository";

import seatAllocationRepository from "./seatAllocation.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ExamApprovalStatus } from "../exam/exam.types";

import { SeatStatus } from "../seat/seat.types";

import { ISeatAllocation, SeatAllocationStatus } from "./seatAllocation.types";
import { BaseService } from "../../common/base.service";

class SeatAllocationService extends BaseService<ISeatAllocation> {
  constructor() {
    super(seatAllocationRepository, "Seat allocation");
  }
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<ISeatAllocation>) {
    const exam = await examRepository.findById(payload.examId!.toString());

    if (!exam) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found.");
    }

    if (exam.approvalStatus !== ExamApprovalStatus.PUBLISHED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Exam is not published.");
    }

    const shift = await examShiftRepository.findById(
      payload.shiftId!.toString(),
    );

    if (!shift) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam shift not found.");
    }

    const examCenter = await examCenterRepository.findById(
      payload.examCenterId!.toString(),
    );

    if (!examCenter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam center not found.");
    }

    const examRoom = await examRoomRepository.findById(
      payload.examRoomId!.toString(),
    );

    if (!examRoom) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam room not found.");
    }

    const seat = await seatRepository.findById(payload.seatId!.toString());

    if (!seat) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Seat not found.");
    }

    if (seat.status !== SeatStatus.AVAILABLE) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Seat is not available.");
    }

    const existingSeat = await seatAllocationRepository.findExisting(
      payload.examRoomId!.toString(),
      payload.seatId!.toString(),
    );

    if (existingSeat) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Seat already allocated.");
    }

    if (payload.candidateId) {
      const existingCandidate =
        await seatAllocationRepository.findCandidateSeat(
          payload.shiftId!.toString(),
          payload.candidateId.toString(),
        );

      if (existingCandidate) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Candidate already has a seat.",
        );
      }
    }

    return await super.create(payload);
  }



  /*
  |--------------------------------------------------------------------------
  | Get By Room
  |--------------------------------------------------------------------------
  */

  async getByRoom(examRoomId: string) {
    return await seatAllocationRepository.findByRoom(examRoomId);
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<ISeatAllocation>) {
    const allocation = await super.getById(id);

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateAllocationStatus(id: string, allocationStatus: SeatAllocationStatus) {
    const allocation = await super.getById(id);

    return await seatAllocationRepository.updateAllocationStatus(id, allocationStatus);
  }



  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(examRoomId?: string) {
    const totalSeats = await seatAllocationRepository.count(examRoomId);

    const availableSeats = await seatAllocationRepository.countByStatus(
      SeatAllocationStatus.AVAILABLE,
      examRoomId,
    );

    const reservedSeats = await seatAllocationRepository.countByStatus(
      SeatAllocationStatus.RESERVED,
      examRoomId,
    );

    const occupiedSeats = await seatAllocationRepository.countByStatus(
      SeatAllocationStatus.OCCUPIED,
      examRoomId,
    );

    const blockedSeats = await seatAllocationRepository.countByStatus(
      SeatAllocationStatus.BLOCKED,
      examRoomId,
    );

    return {
      totalSeats,
      availableSeats,
      reservedSeats,
      occupiedSeats,
      blockedSeats,
    };
  }
}

export default new SeatAllocationService();
