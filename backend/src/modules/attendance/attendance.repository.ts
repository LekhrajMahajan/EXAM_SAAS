import mongoose, { ClientSession, Types } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import { AttendanceModel } from "./attendance.model";

import {
  IAttendance,
  AttendanceStatus,
  VerificationStatus,
} from "./attendance.types";

class AttendanceRepository extends BaseRepository<IAttendance> {
  constructor() {
    super(AttendanceModel, [
      "candidateAssignmentId",
      "admitCardId",
      "candidateId",
      "examId",
      "shiftId",
      "examCenterId",
      "examRoomId",
      "seatAllocationId",
    ]);
  }


  /*
    |--------------------------------------------------------------------------
    | Bulk Create
    |--------------------------------------------------------------------------
    */

  async bulkCreate(payload: Partial<IAttendance>[], session?: ClientSession) {
    return AttendanceModel.insertMany(payload, {
      session,
      ordered: false,
    });
  }



  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return AttendanceModel.findOne({
      _id: id,
      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate Assignment
    |--------------------------------------------------------------------------
    */

  async findByCandidateAssignment(candidateAssignmentId: string) {
    return AttendanceModel.findOne({
      candidateAssignmentId,
      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Admit Card
    |--------------------------------------------------------------------------
    */

  async findByAdmitCard(admitCardId: string) {
    return AttendanceModel.findOne({
      admitCardId,
      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return AttendanceModel.find({
      candidateId,
      isDeleted: false,
    })
      .populate("examId")
      .populate("shiftId")
      .populate("examCenterId")
      .populate("examRoomId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Exam
    |--------------------------------------------------------------------------
    */

  async findByExam(examId: string) {
    return AttendanceModel.find({
      examId,
      isDeleted: false,
    })
      .populate("candidateId")
      .populate("admitCardId");
  }

  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */

  async findAll(filters: any) {
    const { page = 1, limit = 20, search, ...rest } = filters;

    const query: any = {
      isDeleted: false,
    };

    Object.assign(query, rest);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AttendanceModel.find(query)
        .populate("candidateAssignmentId")
        .populate("admitCardId")
        .populate("candidateId")
        .populate("examId")
        .populate("shiftId")
        .populate("examCenterId")
        .populate("examRoomId")
        .populate("seatAllocationId")
        .sort({
          checkInTime: -1,
        })
        .skip(skip)
        .limit(limit),

      AttendanceModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
    | Check In
    |--------------------------------------------------------------------------
    */

  async checkIn(
    id: string,
    payload: Partial<IAttendance>,
    session?: ClientSession,
  ) {
    return AttendanceModel.findByIdAndUpdate(
      id,
      {
        ...payload,

        attendanceStatus: AttendanceStatus.PRESENT,

        checkInTime: new Date(),
      },
      {
        new: true,
        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Check Out
    |--------------------------------------------------------------------------
    */

  async checkOut(id: string, session?: ClientSession) {
    return AttendanceModel.findByIdAndUpdate(
      id,
      {
        attendanceStatus: AttendanceStatus.CHECKED_OUT,

        checkOutTime: new Date(),
      },
      {
        new: true,
        session,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update Verification
    |--------------------------------------------------------------------------
    */

  async updateVerification(
    id: string,
    payload: Partial<IAttendance>,
    session?: ClientSession,
  ) {
    return AttendanceModel.findByIdAndUpdate(
      id,
      {
        ...payload,

        verifiedAt: new Date(),
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

  async count(examId?: any) {
    if (typeof examId === "object") {
      return super.count(examId);
    }
    const query: any = {
      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return AttendanceModel.countDocuments(query);
  }

  /*
    |--------------------------------------------------------------------------
    | Count By Status
    |--------------------------------------------------------------------------
    */

  async countByStatus(status: AttendanceStatus, examId?: string) {
    const query: any = {
      attendanceStatus: status,

      isDeleted: false,
    };

    if (examId) {
      query.examId = examId;
    }

    return AttendanceModel.countDocuments(query);
  }

  /*
    |--------------------------------------------------------------------------
    | Aggregations
    |--------------------------------------------------------------------------
    */

  private async getStatsByFilter(filter: any) {
    const [total, present, absent, pending, late, disqualified, checkedOut] =
      await Promise.all([
        AttendanceModel.countDocuments({ ...filter, isDeleted: false }),
        AttendanceModel.countDocuments({
          ...filter,
          attendanceStatus: AttendanceStatus.PRESENT,
          isDeleted: false,
        }),
        AttendanceModel.countDocuments({
          ...filter,
          attendanceStatus: AttendanceStatus.ABSENT,
          isDeleted: false,
        }),
        AttendanceModel.countDocuments({
          ...filter,
          attendanceStatus: AttendanceStatus.PENDING,
          isDeleted: false,
        }),
        AttendanceModel.countDocuments({
          ...filter,
          attendanceStatus: AttendanceStatus.LATE,
          isDeleted: false,
        }),
        AttendanceModel.countDocuments({
          ...filter,
          attendanceStatus: AttendanceStatus.DISQUALIFIED,
          isDeleted: false,
        }),
        AttendanceModel.countDocuments({
          ...filter,
          attendanceStatus: AttendanceStatus.CHECKED_OUT,
          isDeleted: false,
        }),
      ]);

    return {
      total,
      present,
      absent,
      pending,
      late,
      disqualified,
      checkedOut,
    };
  }

  async aggregateByCenter(examCenterId: string) {
    return this.getStatsByFilter({ examCenterId });
  }

  async aggregateByRoom(examRoomId: string) {
    return this.getStatsByFilter({ examRoomId });
  }

  async aggregateByShift(shiftId: string) {
    return this.getStatsByFilter({ shiftId });
  }

  async aggregateVerification(examId: string, verificationField: string) {
    const total = await AttendanceModel.countDocuments({
      examId,
      isDeleted: false,
    });
    const success = await AttendanceModel.countDocuments({
      examId,
      [verificationField]: VerificationStatus.SUCCESS,
      isDeleted: false,
    });
    const failed = await AttendanceModel.countDocuments({
      examId,
      [verificationField]: VerificationStatus.FAILED,
      isDeleted: false,
    });
    const pending = await AttendanceModel.countDocuments({
      examId,
      [verificationField]: VerificationStatus.PENDING,
      isDeleted: false,
    });
    const bypassed = await AttendanceModel.countDocuments({
      examId,
      [verificationField]: VerificationStatus.BYPASSED,
      isDeleted: false,
    });

    return { total, success, failed, pending, bypassed };
  }

  async deviceAnalytics(examId: string) {
    return AttendanceModel.aggregate([
      { $match: { examId: new Types.ObjectId(examId), isDeleted: false } },
      { $group: { _id: "$deviceId", count: { $sum: 1 } } },
      { $project: { deviceId: "$_id", count: 1, _id: 0 } },
    ]);
  }

  async geoAnalytics(examId: string) {
    return AttendanceModel.aggregate([
      {
        $match: {
          examId: new Types.ObjectId(examId),
          isDeleted: false,
          latitude: { $exists: true },
          longitude: { $exists: true },
        },
      },
      {
        $group: {
          _id: { latitude: "$latitude", longitude: "$longitude" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          latitude: "$_id.latitude",
          longitude: "$_id.longitude",
          count: 1,
          _id: 0,
        },
      },
    ]);
  }

  async hourlyAnalytics(examId: string) {
    return AttendanceModel.aggregate([
      {
        $match: {
          examId: new Types.ObjectId(examId),
          isDeleted: false,
          checkInTime: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: { $hour: "$checkInTime" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { hour: "$_id", count: 1, _id: 0 } },
    ]);
  }
}

export default new AttendanceRepository();
