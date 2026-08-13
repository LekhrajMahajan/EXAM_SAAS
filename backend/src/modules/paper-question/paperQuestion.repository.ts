import PaperQuestion from "./paperQuestion.model";

import { IPaperQuestion, PaperQuestionStatus } from "./paperQuestion.types";
import { BaseRepository } from "../../common/base.repository";

class PaperQuestionRepository extends BaseRepository<IPaperQuestion> {
  constructor() {
    super(PaperQuestion, ["paperId", "questionId"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Create
  |--------------------------------------------------------------------------
  */

  async bulkCreate(payload: Partial<IPaperQuestion>[]) {
    return await PaperQuestion.insertMany(payload, {
      ordered: true,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Paper
  |--------------------------------------------------------------------------
  */

  async findByPaperId(paperId: string) {
    return await PaperQuestion.find({
      paperId,
      isDeleted: false,
    })
      .populate("questionId")
      .sort({
        sectionCode: 1,
        displayOrder: 1,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Question
  |--------------------------------------------------------------------------
  */

  async findByQuestionId(questionId: string) {
    return await PaperQuestion.find({
      questionId,
      isDeleted: false,
    }).populate("paperId");
  }

  /*
  |--------------------------------------------------------------------------
  | Check Duplicate
  |--------------------------------------------------------------------------
  */

  async findDuplicate(paperId: string, questionId: string) {
    return await PaperQuestion.findOne({
      paperId,
      questionId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Section
  |--------------------------------------------------------------------------
  */

  async findBySection(paperId: string, sectionCode: string) {
    return await PaperQuestion.find({
      paperId,
      sectionCode,
      isDeleted: false,
    }).sort({
      displayOrder: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Reorder
  |--------------------------------------------------------------------------
  */

  async reorder(id: string, questionOrder: number, displayOrder: number) {
    return await PaperQuestion.findByIdAndUpdate(
      id,
      {
        questionOrder,
        displayOrder,
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Paper
  |--------------------------------------------------------------------------
  */

  async countByPaper(paperId: string) {
    return await PaperQuestion.countDocuments({
      paperId,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Section
  |--------------------------------------------------------------------------
  */

  async countBySection(paperId: string, sectionCode: string) {
    return await PaperQuestion.countDocuments({
      paperId,
      sectionCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(paperId?: string) {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (paperId) {
      query.paperId = paperId;
    }

    const [total, active, inactive] = await Promise.all([
      PaperQuestion.countDocuments(query),

      PaperQuestion.countDocuments({
        ...query,
        status: PaperQuestionStatus.ACTIVE,
      }),

      PaperQuestion.countDocuments({
        ...query,
        status: PaperQuestionStatus.INACTIVE,
      }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}

export default new PaperQuestionRepository();
