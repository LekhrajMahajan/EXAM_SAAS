import { BaseRepository } from "../../common/base.repository";
import SeatAllocation from "./seatAllocation.model";

import { ISeatAllocation, SeatAllocationStatus } from "./seatAllocation.types";

class SeatAllocationRepository extends BaseRepository<ISeatAllocation> {
  constructor() {
    super(SeatAllocation, [
      "examId",
      "shiftId",
      "examCenterId",
      "examRoomId",
      "seatId",
      "candidateId",
    ]);
  }


  /*
  |--------------------------------------------------------------------------
  | Find Existing Seat
  |--------------------------------------------------------------------------
  */

  async findExisting(examRoomId: string, seatId: string) {
    return await SeatAllocation.findOne({
      examRoomId,
      seatId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find Candidate Seat
  |--------------------------------------------------------------------------
  */

  async findCandidateSeat(shiftId: string, candidateId: string) {
    return await SeatAllocation.findOne({
      shiftId,
      candidateId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find Available Seats
  |--------------------------------------------------------------------------
  */

  async findAvailableSeats(examRoomId: string) {
    return await SeatAllocation.find({
      examRoomId,
      allocationStatus: SeatAllocationStatus.AVAILABLE,
      isDeleted: false,
    }).sort({
      rowNumber: 1,
      columnNumber: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Room
  |--------------------------------------------------------------------------
  */

  async findByRoom(examRoomId: string) {
    return await SeatAllocation.find({
      examRoomId,
      isDeleted: false,
    })
      .populate("seatId")
      .populate("candidateId")
      .sort({
        rowNumber: 1,
        columnNumber: 1,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Get All
  |--------------------------------------------------------------------------
  */

  async findAll(filters: {
    page?: number;
    limit?: number;
    search?: string;
    examId?: string;
    shiftId?: string;
    examCenterId?: string;
    examRoomId?: string;
    seatId?: string;
    candidateId?: string;
    allocationStatus?: SeatAllocationStatus;
    [key: string]: any;
  }): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      examId,
      shiftId,
      examCenterId,
      examRoomId,
      seatId,
      candidateId,
      allocationStatus,
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (examId) query.examId = examId;

    if (shiftId) query.shiftId = shiftId;

    if (examCenterId) query.examCenterId = examCenterId;

    if (examRoomId) query.examRoomId = examRoomId;

    if (seatId) query.seatId = seatId;

    if (candidateId) query.candidateId = candidateId;

    if (allocationStatus) query.allocationStatus = allocationStatus;

    if (search) {
      query.seatNumber = {
        $regex: search,
        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const [allocations, total] = await Promise.all([
      SeatAllocation.find(query)
        .populate("examId")
        .populate("shiftId")
        .populate("examCenterId")
        .populate("examRoomId")
        .populate("seatId")
        .populate("candidateId")
        .sort({
          rowNumber: 1,
          columnNumber: 1,
        })
        .skip(skip)
        .limit(limit),

      SeatAllocation.countDocuments(query),
    ]);

    return {
      allocations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }



  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateAllocationStatus(
    id: string,
    allocationStatus: SeatAllocationStatus,
    session?: import("mongoose").ClientSession,
  ) {
    return await SeatAllocation.findByIdAndUpdate(
      id,
      {
        allocationStatus,
      },
      {
        new: true,
        session,
      },
    );
  }



  /*
  |--------------------------------------------------------------------------
  | Count
  |--------------------------------------------------------------------------
  */

  async count(examRoomId?: any): Promise<number> {
    if (typeof examRoomId === 'object') {
      return super.count(examRoomId);
    }
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (examRoomId) {
      query.examRoomId = examRoomId;
    }

    return await SeatAllocation.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */

  async countByStatus(
    allocationStatus: SeatAllocationStatus,
    examRoomId?: string,
  ) {
    const query: Record<string, unknown> = {
      allocationStatus,
      isDeleted: false,
    };

    if (examRoomId) {
      query.examRoomId = examRoomId;
    }

    return await SeatAllocation.countDocuments(query);
  }
}

export default new SeatAllocationRepository();
