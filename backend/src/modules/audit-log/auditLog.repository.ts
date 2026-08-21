import { ClientSession, QueryFilter as FilterQuery, Types } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import AuditLog from "./auditLog.model";

import {
  AuditAction,
  AuditLogDocument,
  AuditSeverity,
  AuditStatus,
  IAuditLog,
} from "./auditLog.types";

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  companyId?: string;
  examId?: string;
  candidateId?: string;
  employeeId?: string;
  performedBy?: string;
  module?: string;
  action?: AuditAction;
  severity?: AuditSeverity;
  status?: AuditStatus;
  startDate?: Date;
  endDate?: Date;
  entityId?: string;
  entityName?: string;
}

class AuditLogRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLog, [
      "performedBy",
      "companyId",

      "candidateId",
      "employeeId",
      "examId",
    ]);
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */
  async findDeletedById(id: string) {
    return AuditLog.findOne({
      _id: id,
      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By User
    |--------------------------------------------------------------------------
    */
  async findByUser(userId: string) {
    return AuditLog.find({
      performedBy: new Types.ObjectId(userId),
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Module
    |--------------------------------------------------------------------------
    */
  async findByModule(module: string) {
    return AuditLog.find({
      module,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */
  async findAll(query: AuditLogQuery & { [key: string]: any }) {
    const {
      page = 1,
      limit = 20,
      companyId,

      examId,
      candidateId,
      employeeId,
      performedBy,
      module,
      action,
      severity,
      status,
      startDate,
      endDate,
      entityId,
      entityName,
    } = query;

    const filter: FilterQuery<AuditLogDocument> = {
      isDeleted: false,
    };

    if (companyId) filter.companyId = new Types.ObjectId(companyId);

    if (examId) filter.examId = new Types.ObjectId(examId);
    if (candidateId) filter.candidateId = new Types.ObjectId(candidateId);
    if (employeeId) filter.employeeId = new Types.ObjectId(employeeId);
    if (performedBy) filter.performedBy = new Types.ObjectId(performedBy);
    if (module) filter.module = module;
    if (action) filter.action = action;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (entityId) filter.entityId = new Types.ObjectId(entityId);
    if (entityName) filter.entityName = entityName;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const total = await AuditLog.countDocuments(filter);

    const data = await AuditLog.find(filter)
      .populate("performedBy")
      .populate("companyId")

      .populate("candidateId")
      .populate("employeeId")
      .populate("examId")
      .sort({
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
  async count(companyId?: any) {
    if (typeof companyId === "object") {
      return super.count(companyId);
    }
    const filter: FilterQuery<AuditLogDocument> = {
      isDeleted: false,
    };
    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }
    return AuditLog.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Success
    |--------------------------------------------------------------------------
    */
  async countSuccess(companyId?: string) {
    const filter: FilterQuery<AuditLogDocument> = {
      isDeleted: false,
      status: AuditStatus.SUCCESS,
    };

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }

    return AuditLog.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Failed
    |--------------------------------------------------------------------------
    */
  async countFailed(companyId?: string) {
    const filter: FilterQuery<AuditLogDocument> = {
      isDeleted: false,
      status: AuditStatus.FAILED,
    };

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }

    return AuditLog.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */
  async permanentDelete(id: string) {
    return AuditLog.findByIdAndDelete(id);
  }
}

export default new AuditLogRepository();
