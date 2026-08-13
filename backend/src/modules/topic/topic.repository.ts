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
  ) {
    return await Topic.findOne({
      companyId,
      subjectId,
      chapterId,
      topicCode,
      isDeleted: false,
    });
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
  ) {
    return await Topic.findOne({
      companyId,
      subjectId,
      chapterId,
      topicName,
      isDeleted: false,
    });
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
  ) {
    return await Topic.findOne({
      companyId,
      subjectId,
      chapterId,
      topicNumber,
      isDeleted: false,
    });
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
