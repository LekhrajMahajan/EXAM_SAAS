import { Request, Response } from "express";

import topicService from "./topic.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Topic
|--------------------------------------------------------------------------
*/

export const createTopic = asyncHandler(async (req: Request, res: Response) => {
  const result = await topicService.create(req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Topic created successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Topics
|--------------------------------------------------------------------------
*/

export const getTopics = asyncHandler(async (req: Request, res: Response) => {
  const result = await topicService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: req.query.companyId as string,
    subjectId: req.query.subjectId as string,
    chapterId: req.query.chapterId as string,
    examId: req.query.examId === 'null' ? { $exists: false } : (req.query.examId as string),
    status: req.query.status as string,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Topics fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Topic By Id
|--------------------------------------------------------------------------
*/

export const getTopicById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await topicService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Topic fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Topic
|--------------------------------------------------------------------------
*/

export const updateTopic = asyncHandler(async (req: Request, res: Response) => {
  const result = await topicService.update(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Topic updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Topic Status
|--------------------------------------------------------------------------
*/

export const updateTopicStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await topicService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Topic status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Topic
|--------------------------------------------------------------------------
*/

export const deleteTopic = asyncHandler(async (req: Request, res: Response) => {
  const result = await topicService.delete(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Topic deleted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Restore Topic
|--------------------------------------------------------------------------
*/

export const restoreTopic = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await topicService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Topic restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Topic Statistics
|--------------------------------------------------------------------------
*/

export const getTopicStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await topicService.statistics(req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Topic statistics fetched successfully.",
      data: result,
    });
  },
);
