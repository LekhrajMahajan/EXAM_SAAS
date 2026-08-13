import { ClientSession, QueryFilter as FilterQuery, Types } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import FileStorage from "./fileStorage.model";

import {
  FileStatus,
  FileStorageDocument,
  FileType,
  IFileStorage,
  StorageProvider,
} from "./fileStorage.types";

export interface FileStorageQuery {
  page?: number;
  limit?: number;
  companyId?: string;
  candidateId?: string;
  employeeId?: string;
  examId?: string;
  paperId?: string;
  questionId?: string;
  certificateId?: string;
  reportId?: string;
  fileType?: FileType;
  storageProvider?: StorageProvider;
  status?: FileStatus;
  isPublic?: boolean;
}

class FileStorageRepository extends BaseRepository<IFileStorage> {
  constructor() {
    super(FileStorage, [
      "uploadedBy",
      "companyId",
      "branchId",
      "candidateId",
      "employeeId",
      "examId",
      "paperId",
      "questionId",
      "certificateId",
      "reportId",
    ]);
  }

  /*
    |--------------------------------------------------------------------------
    | Bulk Create
    |--------------------------------------------------------------------------
    */
  async bulkCreate(payload: Partial<IFileStorage>[], session?: ClientSession) {
    return FileStorage.insertMany(payload, {
      session,
      ordered: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */
  async findDeletedById(id: string) {
    return FileStorage.findOne({
      _id: id,
      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Checksum
    |--------------------------------------------------------------------------
    */
  async findByChecksum(checksum: string) {
    return FileStorage.findOne({
      checksum,
      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */
  async findAll(query: FileStorageQuery & { [key: string]: any }) {
    const {
      page = 1,
      limit = 20,
      companyId,
      candidateId,
      employeeId,
      examId,
      paperId,
      questionId,
      certificateId,
      reportId,
      fileType,
      storageProvider,
      status,
      isPublic,
    } = query;

    const filter: FilterQuery<FileStorageDocument> = {
      isDeleted: false,
    };

    if (companyId) filter.companyId = new Types.ObjectId(companyId);
    if (candidateId) filter.candidateId = new Types.ObjectId(candidateId);
    if (employeeId) filter.employeeId = new Types.ObjectId(employeeId);
    if (examId) filter.examId = new Types.ObjectId(examId);
    if (paperId) filter.paperId = new Types.ObjectId(paperId);
    if (questionId) filter.questionId = new Types.ObjectId(questionId);
    if (certificateId) filter.certificateId = new Types.ObjectId(certificateId);
    if (reportId) filter.reportId = new Types.ObjectId(reportId);
    if (fileType) filter.fileType = fileType;
    if (storageProvider) filter.storageProvider = storageProvider;
    if (status) filter.status = status;
    if (typeof isPublic === "boolean") filter.isPublic = isPublic;

    const total = await FileStorage.countDocuments(filter);

    const data = await FileStorage.find(filter)
      .populate("uploadedBy")
      .populate("companyId")
      .populate("branchId")
      .populate("candidateId")
      .populate("employeeId")
      .populate("examId")
      .populate("paperId")
      .populate("questionId")
      .populate("certificateId")
      .populate("reportId")
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
    const filter: FilterQuery<FileStorageDocument> = {
      isDeleted: false,
    };
    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }
    return FileStorage.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count By File Type
    |--------------------------------------------------------------------------
    */
  async countByType(fileType: FileType, companyId?: string) {
    const filter: FilterQuery<FileStorageDocument> = {
      fileType,
      isDeleted: false,
    };
    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }
    return FileStorage.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count By Storage Provider
    |--------------------------------------------------------------------------
    */
  async countByProvider(provider: StorageProvider, companyId?: string) {
    const filter: FilterQuery<FileStorageDocument> = {
      storageProvider: provider,
      isDeleted: false,
    };
    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }
    return FileStorage.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Soft Delete
    |--------------------------------------------------------------------------
    */
  async softDelete(id: string, session?: ClientSession) {
    return FileStorage.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        status: FileStatus.DELETED,
        deletedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Restore
    |--------------------------------------------------------------------------
    */
  async restore(id: string, session?: ClientSession) {
    return FileStorage.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        status: FileStatus.ACTIVE,
        deletedAt: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */
  async permanentDelete(id: string) {
    return FileStorage.findByIdAndDelete(id);
  }
}

export default new FileStorageRepository();
