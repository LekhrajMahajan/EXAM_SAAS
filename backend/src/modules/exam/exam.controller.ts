import { Request, Response } from "express";

import examService from "./exam.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import Employee from "../employee/employee.model";
import StaffAssignmentModel from "../staff-assignment/staffAssignment.model";
import mongoose from "mongoose";

import { HTTP_STATUS } from "../../constants/httpStatus";

/*
|--------------------------------------------------------------------------
| Create Exam
|--------------------------------------------------------------------------
*/

export const createExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.create(req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Exam created successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Exams
|--------------------------------------------------------------------------
*/

export const getExams = asyncHandler(async (req: Request, res: Response) => {
  const filters: any = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,

    search: req.query.search as string,

    companyId: req.query.companyId as string,
    subjectId: req.query.subjectId as string,
    paperId: req.query.paperId as string,
    centerId: req.query.centerId as string,
    shiftId: req.query.shiftId as string,

    approvalStatus: req.query.approvalStatus as any,

    status: req.query.status as any,
  };

  if ((req as any).user && (req as any).user.role === 'PRIVATE_AUTHORITY') {
    const employee = await Employee.findOne({ userId: (req as any).user.userId });
    if (employee) {
      const assignments = await StaffAssignmentModel.find({ employeeId: employee._id, isDeleted: false });
      const assignedExamIds = assignments.map((a: any) => a.examId).filter((id: any) => id);
      
      if (assignedExamIds.length > 0) {
        filters._id = { $in: assignedExamIds };
      } else {
        filters._id = new mongoose.Types.ObjectId();
      }
    } else {
      filters._id = new mongoose.Types.ObjectId();
    }
  }

  if ((req as any).user && (req as any).user.role === 'GOVT_AUTHORITY') {
    const privateAssignments = await StaffAssignmentModel.find({ role: 'PRIVATE_AUTHORITY' }).select('examId');
    const privateExamIds = privateAssignments.map((a: any) => a.examId).filter((id: any) => id);
    if (privateExamIds.length > 0) {
      filters._id = { $nin: privateExamIds };
    }
  }

  const result = await examService.getAll(filters);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exams fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Get Exam By Id
|--------------------------------------------------------------------------
*/

export const getExamById = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.getById(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam fetched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Exam
|--------------------------------------------------------------------------
*/

export const updateExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.update(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Exam Status
|--------------------------------------------------------------------------
*/

export const updateExamStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Approval Status
|--------------------------------------------------------------------------
*/

export const updateExamApproval = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.updateApproval(
      req.params.id as string,
      req.body.approvalStatus,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam approval updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Submit For Approval
|--------------------------------------------------------------------------
*/

export const submitExamForApproval = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.submitForApproval(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam submitted for approval successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Approve Exam
|--------------------------------------------------------------------------
*/

export const approveExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.approveExam(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam approved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Reject Exam
|--------------------------------------------------------------------------
*/

export const rejectExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.rejectExam(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam rejected successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Start Exam
|--------------------------------------------------------------------------
*/

export const startExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.startExam(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam started successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| End Exam
|--------------------------------------------------------------------------
*/

export const endExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.endExam(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam ended successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Publish Exam Result
|--------------------------------------------------------------------------
*/

export const publishExamResult = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.publishResult(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam result published successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Auto Select Paper
|--------------------------------------------------------------------------
*/

export const autoSelectPaper = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.autoSelectPaper(req.params.id as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Paper auto-selected successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete Exam
|--------------------------------------------------------------------------
*/

export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.delete(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam deleted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Restore Exam
|--------------------------------------------------------------------------
*/

export const restoreExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.restore(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam restored successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const getExamStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examService.statistics(req.query.companyId as string);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam statistics fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Clone Exam
|--------------------------------------------------------------------------
*/

export const cloneExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.clone(req.params.id as string, req.body);

  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Exam cloned successfully.",
    data: result,
  });
});
/*
|--------------------------------------------------------------------------
| Get Exam Preview
|--------------------------------------------------------------------------
*/

export const getExamPreview = asyncHandler(async (req: Request, res: Response) => {
  const result = await examService.getPreview(req.params.id as string);

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam preview fetched successfully.",
    data: result,
  });
});
