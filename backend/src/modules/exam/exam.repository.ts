import { BaseRepository } from "../../common/base.repository";
import Exam from "./exam.model";

import {
  IExam,
  ExamApprovalStatus,
  ExamStatus,
} from "./exam.types";

class ExamRepository extends BaseRepository<IExam> {
  constructor() {
    super(Exam, ["companyId", "subjectId", "paperId"]);
  }


  /*
  |--------------------------------------------------------------------------
  | Find By Exam Code
  |--------------------------------------------------------------------------
  */

  async findByExamCode(companyId: string, examCode: string) {
    return await Exam.findOne({
      companyId,
      examCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Exam Title
  |--------------------------------------------------------------------------
  */

  async findByExamTitle(companyId: string, examTitle: string) {
    return await Exam.findOne({
      companyId,
      examTitle,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Exams
  |--------------------------------------------------------------------------
  */

  async findAll(filters: {
    page?: number;
    limit?: number;
    search?: string;

    companyId?: string;
    branchId?: string;
    centerId?: string;
    shiftId?: string;
    subjectId?: string;
    paperId?: string;

    approvalStatus?: ExamApprovalStatus;
    status?: ExamStatus;
    [key: string]: any;
  }): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,

      companyId,
      branchId,
      centerId,
      shiftId,
      subjectId,
      paperId,

      approvalStatus,
      status,
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (companyId) query.companyId = companyId;
    if (branchId) query.branchId = branchId;
    if (centerId) query.centerId = centerId;
    if (shiftId) query.shiftId = shiftId;
    if (subjectId) query.subjectId = subjectId;
    if (paperId) query.paperId = paperId;

    if (approvalStatus) query.approvalStatus = approvalStatus;

    if (status) query.status = status;

    if (search) {
      query.$text = {
        $search: search,
      };
    }

    const skip = (page - 1) * limit;

    const [exams, total] = await Promise.all([
      Exam.find(query)
        .populate("companyId")
        .populate("branchId")
        .populate("centerId")
        .populate("shiftId")
        .populate("subjectId")
        .populate("paperId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Exam.countDocuments(query),
    ]);

    return {
      exams,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }



  /*
  |--------------------------------------------------------------------------
  | Get Preview
  |--------------------------------------------------------------------------
  */

  async getPreview(id: string) {
    return await Exam.findOne({ _id: id, isDeleted: false })
      .populate("companyId")
      .populate("branchId")
      .populate("centerId")
      .populate("shiftId")
      .populate("subjectId")
      .populate("paperId");
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: ExamStatus) {
    return await Exam.findByIdAndUpdate(id, { status }, { new: true });
  }

  /*
  |--------------------------------------------------------------------------
  | Update Approval
  |--------------------------------------------------------------------------
  */

  async updateApproval(id: string, approvalStatus: ExamApprovalStatus) {
    return await Exam.findByIdAndUpdate(id, { approvalStatus }, { new: true });
  }



  /*
  |--------------------------------------------------------------------------
  | Count
  |--------------------------------------------------------------------------
  */

  async count(companyId?: any): Promise<number> {
    if (typeof companyId === 'object') {
      return super.count(companyId);
    }
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Exam.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */

  async countByStatus(status: ExamStatus, companyId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Exam.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Approval
  |--------------------------------------------------------------------------
  */

  async countByApproval(
    approvalStatus: ExamApprovalStatus,
    companyId?: string,
  ) {
    const query: Record<string, unknown> = {
      approvalStatus,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Exam.countDocuments(query);
  }
}

export default new ExamRepository();
