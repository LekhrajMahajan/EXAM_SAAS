import { Request, Response } from "express";

import subjectService from "./subject.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Subject
|--------------------------------------------------------------------------
*/

export const createSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Subject created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Subjects
|--------------------------------------------------------------------------
*/

export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const result = await subjectService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    companyId: req.query.companyId as string,
    language: req.query.language as string,
    status: req.query.status as string,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subjects fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Subject By Id
|--------------------------------------------------------------------------
*/

export const getSubjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subject fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Subject
|--------------------------------------------------------------------------
*/

export const updateSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subject updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Subject Status
|--------------------------------------------------------------------------
*/

export const updateSubjectStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subject status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Subject
|--------------------------------------------------------------------------
*/

export const deleteSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.delete(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subject deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore Subject
|--------------------------------------------------------------------------
*/

export const restoreSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subject restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Subject Statistics
|--------------------------------------------------------------------------
*/

export const getSubjectStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await subjectService.statistics(
      req.query.companyId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Subject statistics fetched successfully.",
      data: result,
    });
  },
);
