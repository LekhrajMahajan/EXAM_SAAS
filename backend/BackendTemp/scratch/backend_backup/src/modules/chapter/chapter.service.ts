import companyService from "../company/company.service";
import subjectService from "../subject/subject.service";
import chapterRepository from "./chapter.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { IChapter, ChapterStatus } from "./chapter.types";
import { BaseService } from "../../common/base.service";

class ChapterService extends BaseService<IChapter> {
  constructor() {
    super(chapterRepository, "Chapter");
  }

  /*
  |--------------------------------------------------------------------------
  | Create Chapter
  |--------------------------------------------------------------------------
  */
  async create(payload: Partial<IChapter>) {
    await companyService.getActiveById(payload.companyId!.toString());
    await subjectService.getActiveById(payload.subjectId!.toString());

    const existingCode = await chapterRepository.findByChapterCode(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.chapterCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Chapter code already exists.");
    }

    const existingName = await chapterRepository.findByChapterName(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.chapterName!,
    );

    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Chapter name already exists.");
    }

    const existingNumber = await chapterRepository.findByChapterNumber(
      payload.companyId!.toString(),
      payload.subjectId!.toString(),
      payload.chapterNumber!,
    );

    if (existingNumber) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Chapter number already exists.",
      );
    }

    return await super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Chapters
  |--------------------------------------------------------------------------
  */
  async getAll(query: any) {
    const result = await super.getAll(query);
    return {
      chapters: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Chapter
  |--------------------------------------------------------------------------
  */
  async update(id: string, payload: Partial<IChapter>) {
    const chapter = await chapterRepository.findById(id);

    if (!chapter) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Chapter not found.");
    }

    const companyId =
      (chapter.companyId as any)._id?.toString() ??
      chapter.companyId.toString();

    const subjectId =
      (chapter.subjectId as any)._id?.toString() ??
      chapter.subjectId.toString();

    if (payload.chapterCode && payload.chapterCode !== chapter.chapterCode) {
      const existing = await chapterRepository.findByChapterCode(
        companyId,
        subjectId,
        payload.chapterCode,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Chapter code already exists.",
        );
      }
    }

    if (payload.chapterName && payload.chapterName !== chapter.chapterName) {
      const existing = await chapterRepository.findByChapterName(
        companyId,
        subjectId,
        payload.chapterName,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Chapter name already exists.",
        );
      }
    }

    if (
      payload.chapterNumber &&
      payload.chapterNumber !== chapter.chapterNumber
    ) {
      const existing = await chapterRepository.findByChapterNumber(
        companyId,
        subjectId,
        payload.chapterNumber,
      );

      if (existing) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Chapter number already exists.",
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
    const totalChapters = await chapterRepository.count(companyId ? { companyId } : undefined);

    const activeChapters = await chapterRepository.countByStatus(
      ChapterStatus.ACTIVE,
      companyId,
    );

    const inactiveChapters = await chapterRepository.countByStatus(
      ChapterStatus.INACTIVE,
      companyId,
    );

    const archivedChapters = await chapterRepository.countByStatus(
      ChapterStatus.ARCHIVED,
      companyId,
    );

    return {
      totalChapters,
      activeChapters,
      inactiveChapters,
      archivedChapters,
    };
  }
}

export default new ChapterService();
