import Question from "./question.model";

import {
  ApprovalStatus,
  DifficultyLevel,
  IQuestion,
  QuestionStatus,
  QuestionType,
} from "./question.types";

import { BaseRepository } from "../../common/base.repository";

class QuestionRepository extends BaseRepository<IQuestion> {
  constructor() {
    super(Question, ["companyId", "subjectId", "chapterId", "topicId"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Code
  |--------------------------------------------------------------------------
  */

  async findByQuestionCode(companyId: string, questionCode: string) {
    return await Question.findOne({
      companyId,
      questionCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Update Approval
  |--------------------------------------------------------------------------
  */

  async updateApproval(id: string, approvalStatus: ApprovalStatus) {
    return await Question.findByIdAndUpdate(
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
  | Increase Usage
  |--------------------------------------------------------------------------
  */

  async increaseUsage(id: string) {
    return await Question.findByIdAndUpdate(
      id,
      {
        $inc: {
          usageCount: 1,
        },
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    const [total, approved, draft, published, active] = await Promise.all([
      Question.countDocuments(query),

      Question.countDocuments({
        ...query,
        approvalStatus: ApprovalStatus.APPROVED,
      }),

      Question.countDocuments({
        ...query,
        approvalStatus: ApprovalStatus.DRAFT,
      }),

      Question.countDocuments({
        ...query,
        approvalStatus: ApprovalStatus.PUBLISHED,
      }),

      Question.countDocuments({
        ...query,
        status: QuestionStatus.ACTIVE,
      }),
    ]);

    return {
      total,
      approved,
      draft,
      published,
      active,
    };
  }
}

export default new QuestionRepository();
