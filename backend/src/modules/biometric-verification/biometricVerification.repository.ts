import mongoose, { ClientSession } from "mongoose";

import BiometricVerification from "./biometricVerification.model";

import {
  IBiometricVerification,
  BiometricVerificationStatus,
} from "./biometricVerification.types";

class BiometricVerificationRepository {
  /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

  async create(
    payload: Partial<IBiometricVerification>,
    session?: ClientSession,
  ) {
    const [verification] = await BiometricVerification.create([payload], {
      session,
    });

    return verification;
  }

  /*
    |--------------------------------------------------------------------------
    | Bulk Create
    |--------------------------------------------------------------------------
    */

  async bulkCreate(
    payload: Partial<IBiometricVerification>[],
    session?: ClientSession,
  ) {
    return BiometricVerification.insertMany(payload, {
      ordered: false,
      session,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Id
    |--------------------------------------------------------------------------
    */

  async findById(id: string) {
    return BiometricVerification.findOne({
      _id: id,

      isDeleted: false,
    })
      .populate("attendanceId")
      .populate("admitCardId")
      .populate("candidateAssignmentId")
      .populate("candidateId")
      .populate("examId")
      .populate("examCenterId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return BiometricVerification.findOne({
      _id: id,

      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Attendance
    |--------------------------------------------------------------------------
    */

  async findByAttendance(attendanceId: string) {
    return BiometricVerification.findOne({
      attendanceId,

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return BiometricVerification.find({
      candidateId,

      isDeleted: false,
    })
      .populate("examId")
      .populate("attendanceId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Exam
    |--------------------------------------------------------------------------
    */

  async findByExam(examId: string) {
    return BiometricVerification.find({
      examId,

      isDeleted: false,
    })
      .populate("candidateId")
      .populate("attendanceId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */

  async findAll(filters: any) {
    const {
      page = 1,

      limit = 20,

      search,

      ...rest
    } = filters;

    const query: any = {
      isDeleted: false,
    };

    Object.assign(query, rest);

    if (search) {
      query.deviceId = {
        $regex: search,

        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      BiometricVerification.find(query)
        .populate("candidateId")
        .populate("attendanceId")
        .populate("examId")
        .populate("examCenterId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      BiometricVerification.countDocuments(query),
    ]);

    return {
      data,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Update Scores
    |--------------------------------------------------------------------------
    */

  async updateScores(
    id: string,
    payload: Partial<IBiometricVerification>,
    session?: ClientSession,
  ) {
    return BiometricVerification.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

  async updateStatus(
    id: string,
    status: BiometricVerificationStatus,
    session?: ClientSession,
  ) {
    return BiometricVerification.findByIdAndUpdate(
      id,

      {
        verificationStatus: status,
      },

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Increase Retry Count
    |--------------------------------------------------------------------------
    */

  async increaseRetry(id: string, session?: ClientSession) {
    return BiometricVerification.findByIdAndUpdate(
      id,

      {
        $inc: {
          retryCount: 1,
        },
      },

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Device Lookup
    |--------------------------------------------------------------------------
    */

  async findByDevice(deviceId: string) {
    return BiometricVerification.find({
      deviceId,

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

  async update(
    id: string,
    payload: Partial<IBiometricVerification>,
    session?: ClientSession,
  ) {
    return BiometricVerification.findByIdAndUpdate(
      id,

      payload,

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

  async softDelete(id: string, session?: ClientSession) {
    return BiometricVerification.findByIdAndUpdate(
      id,

      {
        isDeleted: true,

        deletedAt: new Date(),
      },

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */

  async restore(id: string, session?: ClientSession) {
    return BiometricVerification.findByIdAndUpdate(
      id,

      {
        isDeleted: false,

        deletedAt: null,
      },

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

  async count(examId?: string) {
    const query: any = {
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return BiometricVerification.countDocuments(query);
  }

  async countByStatus(status: BiometricVerificationStatus, examId?: string) {
    const query: any = {
      verificationStatus: status,

      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return BiometricVerification.countDocuments(query);
  }
}

export default new BiometricVerificationRepository();
