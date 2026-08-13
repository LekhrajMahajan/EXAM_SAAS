import companyService from "../company/company.service";
import subjectService from "../subject/subject.service";
import chapterService from "../chapter/chapter.service";
import topicService from "../topic/topic.service";

import questionRepository from "./question.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ApprovalStatus, IQuestion, QuestionStatus } from "./question.types";
import { BaseService } from "../../common/base.service";

class QuestionService extends BaseService<IQuestion> {
  constructor() {
    super(questionRepository, "Question");
  }
  /*
  |--------------------------------------------------------------------------
  | Create Question
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IQuestion>) {
    await companyService.getActiveById(payload.companyId!.toString());
    await subjectService.getActiveById(payload.subjectId!.toString());
    await chapterService.getActiveById(payload.chapterId!.toString());
    await topicService.getActiveById(payload.topicId!.toString());

    const existing = await questionRepository.findByQuestionCode(
      payload.companyId!.toString(),
      payload.questionCode!,
    );

    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Question code already exists.");
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Question
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IQuestion>) {
    const question = await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Question not found.");
    }

    if (question.approvalStatus === ApprovalStatus.PUBLISHED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Published question cannot be edited.",
      );
    }

    if (question.approvalStatus === ApprovalStatus.APPROVED) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Approved question cannot be edited.",
      );
    }

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Duplicate Question
  |--------------------------------------------------------------------------
  */

  async duplicate(id: string, options: { copyOptions?: boolean; copyExplanation?: boolean; copyTags?: boolean; status?: QuestionStatus }) {
    const original = await this.getById(id);

    const baseCode = original.questionCode ? original.questionCode.substring(0, 20) : "Q";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newQuestionCode = `${baseCode}-CPY-${randomSuffix}`.toUpperCase();

    // Create a new question based on the original
    const newQuestionData: Partial<IQuestion> = {
      companyId: original.companyId,
      subjectId: original.subjectId,
      chapterId: original.chapterId,
      topicId: original.topicId,
      language: original.language,
      questionType: original.questionType,
      difficulty: original.difficulty,
      question: original.question + " (Copy)",
      marks: original.marks,
      negativeMarks: original.negativeMarks,
      attachments: original.attachments ? [...original.attachments] : [],
      
      // Override status if provided
      status: options.status ?? QuestionStatus.INACTIVE,
      approvalStatus: ApprovalStatus.DRAFT,
      questionCode: newQuestionCode,
    };

    if (options.copyOptions !== false) {
      newQuestionData.options = original.options ? [...original.options] : [];
      newQuestionData.correctAnswer = original.correctAnswer ? [...original.correctAnswer] : [];
    }

    if (options.copyExplanation !== false) {
      newQuestionData.explanation = original.explanation;
    }

    if (options.copyTags !== false) {
      newQuestionData.tags = original.tags ? [...original.tags] : [];
    }

    return await super.create(newQuestionData);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Approval
  |--------------------------------------------------------------------------
  */

  async updateApproval(id: string, approval: ApprovalStatus) {
    const question = await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Question not found.");
    }

    return await questionRepository.updateApproval(id, approval);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    return await questionRepository.statistics(companyId);
  }
}

export default new QuestionService();
