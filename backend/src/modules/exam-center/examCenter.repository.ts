import ExamCenter from "./examCenter.model";

import { IExamCenter, ExamCenterStatus } from "./examCenter.types";

class ExamCenterRepository {
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExamCenter>) {
    const examCenter = new ExamCenter(payload);

    return await examCenter.save();
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id
  |--------------------------------------------------------------------------
  */

  async findById(id: string) {
    return await ExamCenter.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("examId")
      .populate("shiftId")
      .populate("centerId");
  }

  /*
  |--------------------------------------------------------------------------
  | Find Existing Mapping
  |--------------------------------------------------------------------------
  */

  async findExisting(shiftId: string, centerId: string) {
    return await ExamCenter.findOne({
      shiftId,
      centerId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Shift
  |--------------------------------------------------------------------------
  */

  async findByShift(shiftId: string) {
    return await ExamCenter.find({
      shiftId,
      isDeleted: false,
    })
      .populate("centerId")
      .sort({
        createdAt: -1,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Exam
  |--------------------------------------------------------------------------
  */

  async findByExam(examId: string) {
    return await ExamCenter.find({
      examId,
      isDeleted: false,
    })
      .populate("shiftId")
      .populate("centerId")
      .sort({
        createdAt: -1,
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
    status?: ExamCenterStatus;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      examId,
      shiftId,
      centerId,
      status,
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (examId) query.examId = examId;

    if (shiftId) query.shiftId = shiftId;

    if (centerId) query.centerId = centerId;

    if (status) query.status = status;

    if (search) {
      query.$text = {
        $search: search,
      };
    }

    const skip = (page - 1) * limit;

    const [centers, total] = await Promise.all([
      ExamCenter.find(query)
        .populate("examId")
        .populate("shiftId")
        .populate("centerId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      ExamCenter.countDocuments(query),
    ]);

    return {
      centers,
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

  async update(id: string, payload: Partial<IExamCenter>) {
    return await ExamCenter.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("examId")
      .populate("shiftId")
      .populate("centerId");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamCenterStatus) {
    return await ExamCenter.findByIdAndUpdate(
      id,
      {
        status,
      },
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
    return await ExamCenter.findByIdAndUpdate(
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
    return await ExamCenter.findByIdAndUpdate(
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
    return await ExamCenter.findByIdAndUpdate(
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
    return await ExamCenter.findByIdAndUpdate(
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

  async count(examId?: string) {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return await ExamCenter.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */

  async countByStatus(status: ExamCenterStatus, examId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return await ExamCenter.countDocuments(query);
  }
}

export default new ExamCenterRepository();
