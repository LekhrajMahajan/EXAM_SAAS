import { Request, Response } from "express";

import paperService from "./paper.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Paper
|--------------------------------------------------------------------------
*/

export const createPaper = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.create(req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Paper created successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Papers
|--------------------------------------------------------------------------
*/

export const getPapers = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.getAll({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,

    search: req.query.search as string,

    companyId: req.query.companyId as string,
    subjectId: req.query.subjectId as string,

    approvalStatus: req.query.approvalStatus as any,

    status: req.query.status as any,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Papers fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Paper By Id
|--------------------------------------------------------------------------
*/

export const getPaperById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.getById(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Paper Preview
|--------------------------------------------------------------------------
*/

export const getPaperPreview = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.getPreview(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper preview fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Paper
|--------------------------------------------------------------------------
*/

export const updatePaper = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.update(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Paper updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Clone Paper
|--------------------------------------------------------------------------
*/

export const clonePaper = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.clone(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Paper cloned successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Paper Status
|--------------------------------------------------------------------------
*/

export const updatePaperStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Submit For Approval
|--------------------------------------------------------------------------
*/

export const submitPaperForApproval = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.submitForApproval(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper submitted for approval successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Approve Paper
|--------------------------------------------------------------------------
*/

export const approvePaper = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.approvePaper(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper approved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Reject Paper
|--------------------------------------------------------------------------
*/

export const rejectPaper = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.rejectPaper(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper rejected successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Approval
|--------------------------------------------------------------------------
*/

export const updatePaperApproval = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.updateApproval(
      req.params.id as string,
      req.body.approvalStatus,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper approval updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Paper
|--------------------------------------------------------------------------
*/

export const deletePaper = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.delete(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Paper deleted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Paper Question Management (Phase 6)
|--------------------------------------------------------------------------
*/

export const addQuestionToPaper = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.addQuestion(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Question added to paper successfully.",
    data: result,
  });
});

export const updatePaperQuestion = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.updateQuestion(req.params.id as string, req.params.questionId as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Question updated successfully.",
    data: result,
  });
});

export const addBulkQuestionsToPaper = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.addBulkQuestions(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Bulk questions added successfully.",
    data: result,
  });
});

export const removePaperQuestion = asyncHandler(async (req: Request, res: Response) => {
  const result = await paperService.removeQuestion(req.params.id as string, req.params.questionId as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Question removed from paper successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Assigned Papers
|--------------------------------------------------------------------------
*/

export const getAssignedPapers = asyncHandler(async (req: Request, res: Response) => {
  let employeeId = (req as any).user?.employeeId;
  const companyId = (req as any).user?.companyId;
  
  if (!employeeId) {
    const userId = (req as any).user?.userId || (req as any).user?.id;
    const mongoose = require('mongoose');
    const Employee = mongoose.model('Employee');
    const employee = await Employee.findOne({ userId });
    if (employee) {
      employeeId = employee._id.toString();
    }
  }

  const result = await paperService.getAssignedPapersWithAutoCreate(employeeId, companyId);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Assigned papers fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Restore Paper
|--------------------------------------------------------------------------
*/

export const restorePaper = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.restore(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getPaperStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await paperService.statistics(req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper statistics fetched successfully.",
      data: result,
    });
  },
);
