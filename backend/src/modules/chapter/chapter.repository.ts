import Chapter from "./chapter.model";
import { IChapter, ChapterStatus } from "./chapter.types";
import { BaseRepository } from "../../common/base.repository";

class ChapterRepository extends BaseRepository<IChapter> {
  constructor() {
    super(
      Chapter,
      ["companyId", "subjectId"],
      ["chapterCode", "chapterName", "description"]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Chapter Code
  |--------------------------------------------------------------------------
  */
  async findByChapterCode(
    companyId: string,
    subjectId: string,
    chapterCode: string,
  ) {
    return await Chapter.findOne({
      companyId,
      subjectId,
      chapterCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Chapter Name
  |--------------------------------------------------------------------------
  */
  async findByChapterName(
    companyId: string,
    subjectId: string,
    chapterName: string,
  ) {
    return await Chapter.findOne({
      companyId,
      subjectId,
      chapterName,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Chapter Number
  |--------------------------------------------------------------------------
  */
  async findByChapterNumber(
    companyId: string,
    subjectId: string,
    chapterNumber: number,
  ) {
    return await Chapter.findOne({
      companyId,
      subjectId,
      chapterNumber,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Count By Status
  |--------------------------------------------------------------------------
  */
  async countByStatus(status: ChapterStatus, companyId?: string) {
    const query: Record<string, unknown> = {
      status,
      isDeleted: false,
    };

    if (companyId) {
      query.companyId = companyId;
    }

    return await Chapter.countDocuments(query);
  }
}

export default new ChapterRepository();
