import Topic from "./topic.model";
import { ITopic, TopicStatus } from "./topic.types";
import { BaseRepository } from "../../common/base.repository";

class TopicRepository extends BaseRepository<ITopic> {
  constructor() {
    super(
      Topic,
      ["companyId", "subjectId", "chapterId"],
      ["topicCode", "topicName", "description"]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Topic Code
  |--------------------------------------------------------------------------
  */
  async findByTopicCode(
    companyId: string,
    subjectId: string,
    chapterId: string,
    topicCode: string,
    examId?: string,
  ) {
    const query: any = {
      companyId,
      subjectId,
      chapterId,
      topicCode,
      isDeleted: false,
    };
    // When examId is provided, STRICTLY scope to that exam only
    // Use $exists check so topics from OTHER exams (or global) never conflict
    if (examId) {
      query.examId = examId;
    } else {
      query.examId = { $exists: false };
    }
    return await Topic.findOne(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Topic Name
  |--------------------------------------------------------------------------
  */
  async findByTopicName(
    companyId: string,
    subjectId: string,
    chapterId: string,
    topicName: string,
    examId?: string,
  ) {
    const query: any = {
      companyId,
      subjectId,
      chapterId,
      topicName,
      isDeleted: false,
    };
    // When examId is provided, STRICTLY scope to that exam only
    if (examId) {
      query.examId = examId;
    } else {
      query.examId = { $exists: false };
    }
    return await Topic.findOne(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Topic Number
  |--------------------------------------------------------------------------
  */
  async findByTopicNumber(
    companyId: string,
    subjectId: string,
    chapterId: string,
    topicNumber: number,
    examId?: string,
  ) {
    const query: any = {
      companyId,
      subjectId,
      chapterId,
      topicNumber,
      isDeleted: false,
    };
    // When examId is provided, STRICTLY scope to that exam only
    if (examId) {
      query.examId = examId;
    } else {
      query.examId = { $exists: false };
    }
    return await Topic.findOne(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */
  async countByStatus(status: TopicStatus, companyId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Topic.countDocuments(query);
  }
}

export default new TopicRepository();
