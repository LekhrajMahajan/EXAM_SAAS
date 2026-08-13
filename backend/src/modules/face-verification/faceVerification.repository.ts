import mongoose, { ClientSession } from "mongoose";

import FaceVerification from "./faceVerification.model";

import {
  IFaceVerification,
  FaceVerificationStatus,
  FaceLivenessStatus,
  SpoofDetectionStatus,
} from "./faceVerification.types";

class FaceVerificationRepository {
  /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

  async create(payload: Partial<IFaceVerification>, session?: ClientSession) {
    const [verification] = await FaceVerification.create([payload], {
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
    payload: Partial<IFaceVerification>[],
    session?: ClientSession,
  ) {
    return FaceVerification.insertMany(payload, {
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
    return FaceVerification.findOne({
      _id: id,

      isDeleted: false,
    })
      .populate("attendanceId")
      .populate("candidateId")
      .populate("examId")
      .populate("examCenterId")
      .populate("biometricVerificationId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return FaceVerification.findOne({
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
    return FaceVerification.findOne({
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
    return FaceVerification.find({
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
    return FaceVerification.find({
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
      FaceVerification.find(query)
        .populate("candidateId")
        .populate("attendanceId")
        .populate("examId")
        .populate("examCenterId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      FaceVerification.countDocuments(query),
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
    | Update Confidence
    |--------------------------------------------------------------------------
    */

  async updateConfidence(
    id: string,
    confidenceScore: number,
    faceDistance: number,
    session?: ClientSession,
  ) {
    return FaceVerification.findByIdAndUpdate(
      id,

      {
        confidenceScore,

        faceDistance,
      },

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update Liveness
    |--------------------------------------------------------------------------
    */

  async updateLiveness(
    id: string,
    status: FaceLivenessStatus,
    session?: ClientSession,
  ) {
    return FaceVerification.findByIdAndUpdate(
      id,

      {
        livenessStatus: status,
      },

      {
        new: true,

        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update Spoof Detection
    |--------------------------------------------------------------------------
    */

  async updateSpoofDetection(
    id: string,
    status: SpoofDetectionStatus,
    session?: ClientSession,
  ) {
    return FaceVerification.findByIdAndUpdate(
      id,

      {
        spoofDetection: status,
      },

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
    status: FaceVerificationStatus,
    session?: ClientSession,
  ) {
    return FaceVerification.findByIdAndUpdate(
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
    | Retry
    |--------------------------------------------------------------------------
    */

  async increaseRetry(id: string, session?: ClientSession) {
    return FaceVerification.findByIdAndUpdate(
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
    | Update
    |--------------------------------------------------------------------------
    */

  async update(
    id: string,
    payload: Partial<IFaceVerification>,
    session?: ClientSession,
  ) {
    return FaceVerification.findByIdAndUpdate(
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
    return FaceVerification.findByIdAndUpdate(
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
    return FaceVerification.findByIdAndUpdate(
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

    return FaceVerification.countDocuments(query);
  }

  async countByStatus(status: FaceVerificationStatus, examId?: string) {
    const query: any = {
      verificationStatus: status,

      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return FaceVerification.countDocuments(query);
  }
}

export default new FaceVerificationRepository();
