import { ClientSession, QueryFilter as FilterQuery, Types } from "mongoose";

import Certificate from "./certificate.model";

import {
  ICertificate,
  CertificateDocument,
  CertificateStatus,
  CertificateType,
} from "./certificate.types";
import { BaseRepository } from "../../common/base.repository";

export interface CertificateQuery {
  page?: number;

  limit?: number;

  examId?: string;

  resultId?: string;

  candidateId?: string;

  companyId?: string;
  examCenterId?: string;

  certificateStatus?: CertificateStatus;

  certificateType?: CertificateType;
}

class CertificateRepository extends BaseRepository<ICertificate> {
  constructor() {
    super(Certificate, [
      "candidateId",
      "resultId",
      "approvalId",
      "examId",
      "paperId",
      "subjectId",
      "generatedBy",
      "revokedBy",
    ]);
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return Certificate.findOne({
      _id: id,

      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Result
    |--------------------------------------------------------------------------
    */

  async findByResult(resultId: string) {
    return Certificate.findOne({
      resultId: new Types.ObjectId(resultId),

      isDeleted: false,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return Certificate.find({
      candidateId: new Types.ObjectId(candidateId),

      isDeleted: false,
    })

      .sort({
        createdAt: -1,
      });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Verification Code
    |--------------------------------------------------------------------------
    */

  async findByVerificationCode(verificationCode: string) {
    const query = Certificate.findOne({
      $or: [
        { verificationCode: verificationCode },
        { certificateNumber: verificationCode }
      ],
      isDeleted: false,
    });

    this.defaultPopulate.forEach((field) => {
      query.populate(field);
    });

    return query.exec();
  }

  /*
    |--------------------------------------------------------------------------
    | Count Generated
    |--------------------------------------------------------------------------
    */

  async countGenerated(examId?: string) {
    const filter: FilterQuery<CertificateDocument> = {
      isDeleted: false,

      certificateStatus: CertificateStatus.GENERATED,
    };

    if (examId) {
      filter.examId = new Types.ObjectId(examId);
    }

    return Certificate.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Issued
    |--------------------------------------------------------------------------
    */

  async countIssued(examId?: string) {
    const filter: FilterQuery<CertificateDocument> = {
      isDeleted: false,

      certificateStatus: CertificateStatus.ISSUED,
    };

    if (examId) {
      filter.examId = new Types.ObjectId(examId);
    }

    return Certificate.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Revoked
    |--------------------------------------------------------------------------
    */

  async countRevoked(examId?: string) {
    const filter: FilterQuery<CertificateDocument> = {
      isDeleted: false,

      certificateStatus: CertificateStatus.REVOKED,
    };

    if (examId) {
      filter.examId = new Types.ObjectId(examId);
    }

    return Certificate.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

  async permanentDelete(id: string) {
    return Certificate.findByIdAndDelete(id);
  }
}

export default new CertificateRepository();
