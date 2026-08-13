import { BaseRepository } from "../../common/base.repository";
import Paper from "./paper.model";

import { IPaper, PaperApprovalStatus, PaperStatus } from "./paper.types";

class PaperRepository extends BaseRepository<IPaper> {
  constructor() {
    super(Paper, ["companyId", "subjectId"]);
  }


  /*
  |--------------------------------------------------------------------------
  | Find By Paper Code
  |--------------------------------------------------------------------------
  */

  async findByPaperCode(companyId: string, paperCode: string) {
    return await Paper.findOne({
      companyId,
      paperCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Paper Name
  |--------------------------------------------------------------------------
  */

  async findByPaperName(
    companyId: string,
    subjectId: string,
    paperName: string,
  ) {
    return await Paper.findOne({
      companyId,
      subjectId,
      paperName,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Papers
  |--------------------------------------------------------------------------
  */

  async findAll(filters: {
    page?: number;
    limit?: number;
    search?: string;

    companyId?: string;
    subjectId?: string;

    approvalStatus?: PaperApprovalStatus;
    assignedTo?: string;

    status?: PaperStatus;
    [key: string]: any;
  }): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,

      companyId,
      subjectId,

      approvalStatus,
      assignedTo,
      status,
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (companyId) query.companyId = companyId;

    if (subjectId) query.subjectId = subjectId;

    if (approvalStatus) query.approvalStatus = approvalStatus;

    if (status) query.status = status;

    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      if (companyId) {
        query.$text = {
          $search: search,
        };
      } else {
        query.$or = [
          { paperName: { $regex: search, $options: "i" } },
          { paperCode: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    }

    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      Paper.find(query)
        .populate("companyId")
        .populate("subjectId")
        .populate("examId")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Paper.countDocuments(query),
    ]);

    return {
      papers,
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

  async updateStatus(id: string, status: PaperStatus) {
    return await Paper.findByIdAndUpdate(
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
  | Update Approval
  |--------------------------------------------------------------------------
  */

  async updateApproval(id: string, approvalStatus: PaperApprovalStatus) {
    return await Paper.findByIdAndUpdate(
      id,
      {
        approvalStatus,
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

    return await Paper.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */

  async countByStatus(status: PaperStatus, companyId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Paper.countDocuments(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Approval
  |--------------------------------------------------------------------------
  */

  async countByApproval(
    approvalStatus: PaperApprovalStatus,
    companyId?: string,
  ) {
    const query: Record<string, unknown> = {
      approvalStatus,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Paper.countDocuments(query);
  }
}

export default new PaperRepository();
