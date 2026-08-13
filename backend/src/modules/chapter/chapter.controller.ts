import { Request, Response } from "express";

import chapterService from "./chapter.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Chapter
|--------------------------------------------------------------------------
*/

export const createChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Chapter created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Chapters
|--------------------------------------------------------------------------
*/

export const getChapters = asyncHandler(async (req: Request, res: Response) => {
  const result = await chapterService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: req.query.companyId as string,
    subjectId: req.query.subjectId as string,
    status: req.query.status as string,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Chapters fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Chapter By Id
|--------------------------------------------------------------------------
*/

export const getChapterById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Chapter fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Chapter
|--------------------------------------------------------------------------
*/

export const updateChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Chapter updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Chapter Status
|--------------------------------------------------------------------------
*/

export const updateChapterStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Chapter status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Chapter
|--------------------------------------------------------------------------
*/

export const deleteChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Chapter deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Chapter
|--------------------------------------------------------------------------
*/

export const restoreChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Chapter restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Chapter Statistics
|--------------------------------------------------------------------------
*/

export const getChapterStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await chapterService.statistics(
      req.query.companyId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Chapter statistics fetched successfully.",
      data: result,
    });
  },
);
