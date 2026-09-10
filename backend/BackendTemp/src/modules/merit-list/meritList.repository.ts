import { ClientSession, QueryFilter as FilterQuery, Types } from "mongoose";

import MeritList from "./meritList.model";

import { IMeritList, MeritListDocument, MeritStatus } from "./meritList.types";
import { BaseRepository } from "../../common/base.repository";

export interface MeritListQuery {
  page?: number;

  limit?: number;

  examId?: string;

  candidateId?: string;

  companyId?: string;
  examCenterId?: string;

  subjectId?: string;

  meritStatus?: MeritStatus;
}

class MeritListRepository extends BaseRepository<IMeritList> {
  constructor() {
    super(MeritList, ["candidateId", "examId", "resultId", "certificateId", "subjectId", "publishedBy"]);
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return MeritList.findOne({
      _id: id,

      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find One
    |--------------------------------------------------------------------------
    */

  async findOne(filter: FilterQuery<MeritListDocument>) {
    return MeritList.findOne(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return MeritList.find({
      candidateId: new Types.ObjectId(candidateId),

      isDeleted: false,
    })

      .sort({
        overallRank: 1,
      })
      .populate(this.defaultPopulate);
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Exam
    |--------------------------------------------------------------------------
    */

  async findByExam(examId: string) {
    const query = MeritList.find({
      examId: new Types.ObjectId(examId),
      isDeleted: { $ne: true },
    })
      .sort({
        overallRank: 1,
      });

    this.defaultPopulate.forEach((field) => {
      query.populate(field);
    });

    return query;
  }

  /*
    |--------------------------------------------------------------------------
    | Find Top Rankers
    |--------------------------------------------------------------------------
    */

  async findTopRankers(
    examId: string,

    limit = 10,
  ) {
    return MeritList.find({
      examId: new Types.ObjectId(examId),

      meritStatus: MeritStatus.PUBLISHED,

      isDeleted: false,
    })

      .sort({
        overallRank: 1,
      })

      .limit(limit);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Generated
    |--------------------------------------------------------------------------
    */

  async countGenerated(examId?: string) {
    const filter: FilterQuery<MeritListDocument> = {
      isDeleted: false,

      meritStatus: MeritStatus.GENERATED,
    };

    if (examId) {
      filter.examId = new Types.ObjectId(examId);
    }

    return MeritList.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Published
    |--------------------------------------------------------------------------
    */

  async countPublished(examId?: string) {
    const filter: FilterQuery<MeritListDocument> = {
      isDeleted: false,

      meritStatus: MeritStatus.PUBLISHED,
    };

    if (examId) {
      filter.examId = new Types.ObjectId(examId);
    }

    return MeritList.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Update Many
    |--------------------------------------------------------------------------
    */

  async updateMany(filter: FilterQuery<MeritListDocument>, update: any) {
    return MeritList.updateMany(filter, update);
  }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

  async permanentDelete(id: string) {
    return MeritList.findByIdAndDelete(id);
  }
}

export default new MeritListRepository();
