import ExamRoom from "./examRoom.model";

import { IExamRoom, ExamRoomStatus } from "./examRoom.types";

class ExamRoomRepository {
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExamRoom>) {
    const examRoom = new ExamRoom(payload);

    return await examRoom.save();
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id
  |--------------------------------------------------------------------------
  */

  async findById(id: string) {
    return await ExamRoom.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("examId")
      .populate("shiftId")
      .populate("centerId")
      .populate("roomId");
  }

  /*
  |--------------------------------------------------------------------------
  | Find Existing
  |--------------------------------------------------------------------------
  */

  async findExisting(centerId: string, roomId: string) {
    return await ExamRoom.findOne({
      centerId,
      roomId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Center
  |--------------------------------------------------------------------------
  */

  async findByCenter(centerId: string) {
    return await ExamRoom.find({
      centerId,
      isDeleted: false,
    })
      .populate("roomId")
      .sort({
        roomNumber: 1,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Shift
  |--------------------------------------------------------------------------
  */

  async findByShift(shiftId: string) {
    return await ExamRoom.find({
      shiftId,
      isDeleted: false,
    })
      .populate("centerId")
      .populate("roomId")
      .sort({
        roomNumber: 1,
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
    centerId?: string;
    roomId?: string;
    status?: ExamRoomStatus;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      examId,
      shiftId,
      centerId,
      roomId,
      status,
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (examId) query.examId = examId;

    if (shiftId) query.shiftId = shiftId;

    if (centerId) query.centerId = centerId;

    if (roomId) query.roomId = roomId;

    if (status) query.status = status;

    if (search) {
      query.$or = [
        {
          roomNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          buildingName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      ExamRoom.find(query)
        .populate("examId")
        .populate("shiftId")
        .populate("centerId")
        .populate("roomId")
        .sort({
          roomNumber: 1,
        })
        .skip(skip)
        .limit(limit),

      ExamRoom.countDocuments(query),
    ]);

    return {
      rooms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IExamRoom>) {
    return await ExamRoom.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("examId")
      .populate("shiftId")
      .populate("centerId")
      .populate("roomId");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamRoomStatus) {
    return await ExamRoom.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Increment Allocated Candidates
  |--------------------------------------------------------------------------
  */

  async incrementAllocatedCandidates(
    id: string,
    amount: number,
    session?: import("mongoose").ClientSession,
  ) {
    return await ExamRoom.findByIdAndUpdate(
      id,
      {
        $inc: { allocatedCandidates: amount },
      },
      {
        new: true,
        session,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Available Seats
  |--------------------------------------------------------------------------
  */

  async updateAvailableSeats(
    id: string,
    amount: number,
    session?: import("mongoose").ClientSession,
  ) {
    return await ExamRoom.findByIdAndUpdate(
      id,
      {
        $inc: { availableSeats: amount },
      },
      {
        new: true,
        session,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */

  async softDelete(id: string) {
    return await ExamRoom.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(id: string) {
    return await ExamRoom.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Count
  |--------------------------------------------------------------------------
  */

  async count(centerId?: string) {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (centerId) {
      query.centerId = centerId;
    }

    return await ExamRoom.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */

  async countByStatus(status: ExamRoomStatus, centerId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (centerId) {
      query.centerId = centerId;
    }

    return await ExamRoom.countDocuments(query);
  }
}

export default new ExamRoomRepository();
