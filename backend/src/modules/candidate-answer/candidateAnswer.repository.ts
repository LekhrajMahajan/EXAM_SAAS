import {
  ClientSession,
  Types,
} from "mongoose";

import CandidateAnswer from "./candidateAnswer.model";
import { BaseRepository } from "../../common/base.repository";

import {
  ICandidateAnswer,
  CandidateAnswerDocument,
  QuestionStatus,
} from "./candidateAnswer.types";

export interface CandidateAnswerQuery {
  page?: number;
  limit?: number;
  submissionId?: string;
  candidateId?: string;
  examId?: string;
  paperId?: string;
  questionId?: string;
  questionStatus?: QuestionStatus;
}

class CandidateAnswerRepository extends BaseRepository<ICandidateAnswer> {
  constructor() {
    super(CandidateAnswer);
  }


  /*
  |--------------------------------------------------------------------------
  | Find By Submission
  |--------------------------------------------------------------------------
  */
  async findBySubmission(
    submissionId: string
  ) {
    return CandidateAnswer.find({
      submissionId: new Types.ObjectId(submissionId),
    })
    .sort({
      questionNumber: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Question
  |--------------------------------------------------------------------------
  */
  async findByQuestion(
    submissionId: string,
    questionId: string
  ) {
    return CandidateAnswer.findOne({
      submissionId: new Types.ObjectId(submissionId),
      questionId: new Types.ObjectId(questionId),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Save Answer
  |--------------------------------------------------------------------------
  */
  async saveAnswer(
    submissionId: string,
    questionId: string,
    payload: Partial<ICandidateAnswer>
  ) {
    return CandidateAnswer.findOneAndUpdate(
      {
        submissionId: new Types.ObjectId(submissionId),
        questionId: new Types.ObjectId(questionId),
      },
      {
        $set: payload,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );
  }



  /*
  |--------------------------------------------------------------------------
  | Find All
  |--------------------------------------------------------------------------
  */
  async findAll(
      query: CandidateAnswerQuery
  ) {
      const {
          page = 1,
          limit = 20,
          submissionId,
          candidateId,
          examId,
          paperId,
          questionId,
          questionStatus,
      } = query;
      const filter: Record<string, any> = {};

      if (submissionId)
          filter.submissionId = new Types.ObjectId(submissionId);

      if (candidateId)
          filter.candidateId = new Types.ObjectId(candidateId);

      if (examId)
          filter.examId = new Types.ObjectId(examId);

      if (paperId)
          filter.paperId = new Types.ObjectId(paperId);

      if (questionId)
          filter.questionId = new Types.ObjectId(questionId);

      if (questionStatus)
          filter.questionStatus = questionStatus;

      const total =
          await CandidateAnswer.countDocuments(filter);

      const data =
          await CandidateAnswer.find(filter)
              .sort({
                  questionNumber: 1,
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
  async countBySubmission(
      submissionId?: string
  ) {
      const filter: Record<string, any> = {};

      if (submissionId)
          filter.submissionId = new Types.ObjectId(submissionId);

      return CandidateAnswer.countDocuments(filter);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */
  async statistics(
      submissionId: string
  ) {
      return CandidateAnswer.aggregate([
          {
              $match: {
                  submissionId: new Types.ObjectId(submissionId),
              },
          },
          {
              $group: {
                  _id: "$questionStatus",
                  total: {
                      $sum: 1,
                  },
              },
          },
      ]);
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */
  async dashboard(
      submissionId: string
  ) {
      const [
          total,
          statistics,
      ] = await Promise.all([
          this.countBySubmission(submissionId),
          this.statistics(submissionId),
      ]);

      return {
          total,
          statistics,
      };
  }

  /*
  |--------------------------------------------------------------------------
  | Mark Review
  |--------------------------------------------------------------------------
  */
  async markForReview(
      id: string,
      review: boolean
  ) {
      return CandidateAnswer.findByIdAndUpdate(
          id,
          {
              isMarkedForReview: review,
              questionStatus: review
                  ? QuestionStatus.MARKED_FOR_REVIEW
                  : QuestionStatus.NOT_ANSWERED,
          },
          {
              new: true,
          }
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Clear Answer
  |--------------------------------------------------------------------------
  */
  async clearAnswer(
      id: string
  ) {
      return CandidateAnswer.findByIdAndUpdate(
          id,
          {
              selectedOption: null,
              selectedOptions: [],
              numericalAnswer: null,
              subjectiveAnswer: null,
              uploadedFile: null,
              isAnswered: false,
              questionStatus:
                  QuestionStatus.NOT_ANSWERED,
          },
          {
              new: true,
          }
      );
  }
}

export default new CandidateAnswerRepository();
