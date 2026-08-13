import { ClientSession, QueryFilter as FilterQuery, Types } from "mongoose";

import Result from "./result.model";

import {
  IResult,
  ResultDocument,
  PassStatus,
  ResultStatus,
} from "./result.types";

export interface ResultQuery {
  page?: number;

  limit?: number;

  examId?: string;

  candidateId?: string;

  submissionId?: string;

  paperId?: string;

  subjectId?: string;

  companyId?: string;

  branchId?: string;

  examCenterId?: string;

  examRoomId?: string;

  passStatus?: PassStatus;

  resultStatus?: ResultStatus;
}

import { BaseRepository } from "../../common/base.repository";

class ResultRepository extends BaseRepository<IResult> {
  constructor() {
    super(Result, ["examId", "paperId", "subjectId", "attendanceId"]);
  }


  /*
    |--------------------------------------------------------------------------
    | Find Deleted By Id
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string): Promise<ResultDocument | null> {
    return Result.findOne({
      _id: id,

      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Submission
    |--------------------------------------------------------------------------
    */

  async findBySubmission(submissionId: string) {
    return Result.findOne({
      submissionId: new Types.ObjectId(submissionId),

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Attendance
    |--------------------------------------------------------------------------
    */

  async findByAttendance(attendanceId: string) {
    return Result.findOne({
      attendanceId: new Types.ObjectId(attendanceId),

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return Result.find({
      candidateId: new Types.ObjectId(candidateId),

      isDeleted: false,
    })

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
    return Result.find({
      examId: new Types.ObjectId(examId),

      isDeleted: false,
    })

      .sort({
        percentage: -1,

        rank: 1,
      });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Paper
    |--------------------------------------------------------------------------
    */

  async findByPaper(paperId: string) {
    return Result.find({
      paperId: new Types.ObjectId(paperId),

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Subject
    |--------------------------------------------------------------------------
    */

  async findBySubject(subjectId: string) {
    return Result.find({
      subjectId: new Types.ObjectId(subjectId),

      isDeleted: false,
    });
  }



  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */

  async findAll(query: ResultQuery) {
    const {
      page = 1,

      limit = 20,

      examId,

      candidateId,

      submissionId,

      paperId,

      subjectId,

      companyId,

      branchId,

      examCenterId,

      examRoomId,

      passStatus,

      resultStatus,
    } = query;

    const filter: FilterQuery<ResultDocument> = {
      isDeleted: false,
    };

    if (examId) filter.examId = new Types.ObjectId(examId);

    if (candidateId) filter.candidateId = new Types.ObjectId(candidateId);

    if (submissionId) filter.submissionId = new Types.ObjectId(submissionId);

    if (paperId) filter.paperId = new Types.ObjectId(paperId);

    if (subjectId) filter.subjectId = new Types.ObjectId(subjectId);

    if (companyId) filter.companyId = new Types.ObjectId(companyId);

    if (branchId) filter.branchId = new Types.ObjectId(branchId);

    if (examCenterId) filter.examCenterId = new Types.ObjectId(examCenterId);

    if (examRoomId) filter.examRoomId = new Types.ObjectId(examRoomId);

    if (passStatus) filter.passStatus = passStatus;

    if (resultStatus) filter.resultStatus = resultStatus;

    const total = await Result.countDocuments(filter);

    const data = await Result.find(filter)

      .populate("examId")

      .populate("paperId")

      .populate("subjectId")

      .populate("attendanceId")

      .sort({
        percentage: -1,

        createdAt: -1,
      })

      .skip((page - 1) * limit)

      .limit(limit);

    return {
      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),

      data,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Count
    |--------------------------------------------------------------------------
    */

  async count(examId?: any): Promise<number> {
    if (typeof examId === 'object') {
      return super.count(examId);
    }
    const filter: FilterQuery<ResultDocument> = {
      isDeleted: false,
    };

    if (examId) filter.examId = new Types.ObjectId(examId);

    return Result.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Passed
    |--------------------------------------------------------------------------
    */

  async countPassed(examId?: string) {
    const filter: FilterQuery<ResultDocument> = {
      isDeleted: false,

      passStatus: PassStatus.PASSED,
    };

    if (examId) filter.examId = new Types.ObjectId(examId);

    return Result.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Failed
    |--------------------------------------------------------------------------
    */

  async countFailed(examId?: string) {
    const filter: FilterQuery<ResultDocument> = {
      isDeleted: false,

      passStatus: PassStatus.FAILED,
    };

    if (examId) filter.examId = new Types.ObjectId(examId);

    return Result.countDocuments(filter);
  }



  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

  async permanentDelete(id: string) {
    return Result.findByIdAndDelete(id);
  }
}

export default new ResultRepository();
