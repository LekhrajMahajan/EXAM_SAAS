import companyService from "../company/company.service";
import subjectService from "../subject/subject.service";
import subjectRepository from "../subject/subject.repository";
import chapterService from "../chapter/chapter.service";
import chapterRepository from "../chapter/chapter.repository";
import topicRepository from "./topic.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ITopic, TopicStatus } from "./topic.types";
import { BaseService } from "../../common/base.service";

class TopicService extends BaseService<ITopic> {
  constructor() {
    super(topicRepository, "Topic");
  }

  /*
  |--------------------------------------------------------------------------
  | Create Topic
  |--------------------------------------------------------------------------
  */
  async create(payload: Partial<ITopic>) {
    await companyService.getActiveById(payload.companyId!.toString());
    
    if (payload.subjectId) {
      await subjectService.getActiveById(payload.subjectId!.toString());
    } else if (payload.subjectName) {
      let subject: any = await subjectRepository.findBySubjectName(
        payload.companyId!.toString(),
        payload.subjectName
      );
      if (!subject) {
        subject = await subjectService.create({
          companyId: payload.companyId,
          subjectName: payload.subjectName,
          subjectCode: payload.subjectName.substring(0, 10).toUpperCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000),
          subjectShortName: payload.subjectName.substring(0, 5).toUpperCase().replace(/\s/g, '') + Math.floor(Math.random() * 100),
          duration: 60,
          totalMarks: 100,
          passingMarks: 40
        });
      }
      payload.subjectId = subject._id;
    } else {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Subject is required.");
    }

    if (!payload.chapterId) {
      // Find or create a default "General" chapter for this subject
      let chapter: any = await chapterRepository.findByChapterName(
        payload.companyId!.toString(),
        payload.subjectId!.toString(),
        "General"
      );
      if (!chapter) {
        chapter = await chapterService.create({
          companyId: payload.companyId,
          subjectId: payload.subjectId,
          chapterName: "General",
          chapterCode: "GEN",
          chapterNumber: 1
        });
      }
      payload.chapterId = chapter._id;
    } else {
      await chapterService.getActiveById(payload.chapterId!.toString());
    }
    const existingCode = await topicRepository.findByTopicCode(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.chapterId!.toString(),
      payload.topicCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Topic code already exists.");
    }

    const existingName = await topicRepository.findByTopicName(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.chapterId!.toString(),
      payload.topicName!,
    );

    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Topic name already exists.");
    }

    const existingNumber = await topicRepository.findByTopicNumber(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.chapterId!.toString(),
      payload.topicNumber!,
    );

    if (existingNumber) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Topic number already exists.");
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Topics
  |--------------------------------------------------------------------------
  */
  async getAll(query: any) {
    const result = await super.getAll(query);
    return {
      topics: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Topic
  |--------------------------------------------------------------------------
  */
  async update(id: string, payload: Partial<ITopic>) {
    const topic = await topicRepository.findById(id);

    if (!topic) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Topic not found.");
    }

    const companyId =
      (topic.companyId as any)._id?.toString() ?? topic.companyId.toString();

    const subjectId =
      (topic.subjectId as any)._id?.toString() ?? topic.subjectId.toString();

    const chapterId =
      (topic.chapterId as any)._id?.toString() ?? topic.chapterId.toString();

    if (payload.topicCode && payload.topicCode !== topic.topicCode) {
      const existing = await topicRepository.findByTopicCode(
        companyId,
        subjectId,
        chapterId,
        payload.topicCode,
      );

      if (existing) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Topic code already exists.");
      }
    }

    if (payload.topicName && payload.topicName !== topic.topicName) {
      const existing = await topicRepository.findByTopicName(
        companyId,
        subjectId,
        chapterId,
        payload.topicName,
      );

      if (existing) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Topic name already exists.");
      }
    }

    if (payload.topicNumber && payload.topicNumber !== topic.topicNumber) {
      const existing = await topicRepository.findByTopicNumber(
        companyId,
        subjectId,
        chapterId,
        payload.topicNumber,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Topic number already exists.",
        );
      }
    }

    return await super.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */
  async statistics(companyId?: string) {
    const totalTopics = await topicRepository.count(companyId ? { companyId } : undefined);

    const activeTopics = await topicRepository.countByStatus(
      TopicStatus.ACTIVE,
      companyId,
    );

    const inactiveTopics = await topicRepository.countByStatus(
      TopicStatus.INACTIVE,
      companyId,
    );

    const archivedTopics = await topicRepository.countByStatus(
      TopicStatus.ARCHIVED,
      companyId,
    );

    return {
      totalTopics,
      activeTopics,
      inactiveTopics,
      archivedTopics,
    };
  }
}

export default new TopicService();
