import ExamShift from "./examShift.model";

import { IExamShift, ExamShiftStatus } from "./examShift.types";

class ExamShiftRepository {
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExamShift>) {
    const shift = new ExamShift(payload);

    return await shift.save();
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id
  |--------------------------------------------------------------------------
  */

  async findById(id: string) {
    return await ExamShift.findOne({
      _id: id,
      isDeleted: false,
    }).populate("examId");
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Shift Code
  |--------------------------------------------------------------------------
  */

  async findByShiftCode(examId: string, shiftCode: string) {
    return await ExamShift.findOne({
      examId,
      shiftCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Shift Number
  |--------------------------------------------------------------------------
  */

  async findByShiftNumber(examId: string, shiftNumber: number) {
    return await ExamShift.findOne({
      examId,
      shiftNumber,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Exam
  |--------------------------------------------------------------------------
  */

  async findByExamId(examId: string) {
    return await ExamShift.find({
      examId,
      isDeleted: false,
    }).sort({
      shiftNumber: 1,
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
    status?: ExamShiftStatus;
  }) {
    const { page = 1, limit = 10, search, examId, status } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = {
        $search: search,
      };
    }

    const skip = (page - 1) * limit;

    const [shifts, total] = await Promise.all([
      ExamShift.find(query)
        .populate("examId")
        .sort({
          shiftNumber: 1,
        })
        .skip(skip)
        .limit(limit),

      ExamShift.countDocuments(query),
    ]);

    return {
      shifts,
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

  async update(id: string, payload: Partial<IExamShift>) {
    return await ExamShift.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).populate("examId");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamShiftStatus) {
    return await ExamShift.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */

  async softDelete(id: string) {
    return await ExamShift.findByIdAndUpdate(
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
    return await ExamShift.findByIdAndUpdate(
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

    return await ExamShift.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */

  async countByStatus(status: ExamShiftStatus, examId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return await ExamShift.countDocuments(query);
  }
}

export default new ExamShiftRepository();
