import paperRepository from "../paper/paper.repository";
import questionRepository from "../question-bank/question.repository";
import paperQuestionRepository from "./paperQuestion.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ApprovalStatus } from "../question-bank/question.types";

import { PaperApprovalStatus } from "../paper/paper.types";

import { IPaperQuestion, PaperQuestionStatus } from "./paperQuestion.types";
import { BaseService } from "../../common/base.service";

class PaperQuestionService extends BaseService<IPaperQuestion> {
  constructor() {
    super(paperQuestionRepository, "PaperQuestion");
  }
  /*
  |--------------------------------------------------------------------------
  | Add Question
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IPaperQuestion>) {
    const paper = await paperRepository.findById(payload.paperId!.toString());

    if (!paper) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Paper not found.");
    }

    if (paper.approvalStatus === PaperApprovalStatus.PUBLISHED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Published paper cannot be modified.",
      );
    }

    const question = await questionRepository.findById(
      payload.questionId!.toString(),
    );

    if (!question) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Question not found.");
    }

    if (question.approvalStatus !== ApprovalStatus.PUBLISHED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Only published questions can be added.",
      );
    }

    const duplicate = await paperQuestionRepository.findDuplicate(
      payload.paperId!.toString(),
      payload.questionId!.toString(),
    );

    if (duplicate) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Question already exists in paper.",
      );
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Add
  |--------------------------------------------------------------------------
  */

  async bulkCreate(payload: Partial<IPaperQuestion>[]) {
    return await paperQuestionRepository.bulkCreate(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Paper
  |--------------------------------------------------------------------------
  */

  async getByPaper(paperId: string) {
    const paper = await paperRepository.findById(paperId);

    if (!paper) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Paper not found.");
    }

    return await paperQuestionRepository.findByPaperId(paperId);
  }

  /*
  |--------------------------------------------------------------------------
  | Reorder
  |--------------------------------------------------------------------------
  */

  async reorder(
    questions: {
      id: string;
      questionOrder: number;
      displayOrder: number;
    }[],
  ) {
    const result = [];

    for (const item of questions) {
      const updated = await paperQuestionRepository.reorder(
        item.id,
        item.questionOrder,
        item.displayOrder,
      );

      result.push(updated);
    }

    return result;
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(paperId?: string) {
    return await paperQuestionRepository.statistics(paperId);
  }
}

export default new PaperQuestionService();
