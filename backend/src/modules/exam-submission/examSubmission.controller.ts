import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import examSubmissionService from "./examSubmission.service";

/*
|--------------------------------------------------------------------------
| Create Submission
|--------------------------------------------------------------------------
*/

export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examSubmissionService.create(req.body);

    sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Exam submission created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Start Exam
|--------------------------------------------------------------------------
*/

export const startExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.startExam(req.params.id as string);

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam started successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Resume Exam
|--------------------------------------------------------------------------
*/

export const resumeExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.resumeExam(
    req.params.id as string,
  );

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam resumed successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Pause Exam
|--------------------------------------------------------------------------
*/

export const pauseExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.pauseExam(req.params.id as string);

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam paused successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Submit Exam
|--------------------------------------------------------------------------
*/

export const submitExam = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.submitExam(
    req.params.id as string,
  );

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam submitted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Submit Exam By POST (Mock)
|--------------------------------------------------------------------------
*/

export const submitExamByPost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { examId, candidateId } = req.body;
    const mongoose = require("mongoose");
    const ExamSubmission = require("./examSubmission.model").default;
    
    if (examId && candidateId) {
      await ExamSubmission.findOneAndUpdate(
        {
          examId: new mongoose.Types.ObjectId(examId),
          candidateId: new mongoose.Types.ObjectId(candidateId)
        },
        {
          $set: {
            candidateAssignmentId: new mongoose.Types.ObjectId(),
            shiftId: req.body.shiftId ? new mongoose.Types.ObjectId(req.body.shiftId) : new mongoose.Types.ObjectId(),
            examCenterId: new mongoose.Types.ObjectId(),
            examRoomId: new mongoose.Types.ObjectId(),
            seatAllocationId: new mongoose.Types.ObjectId(),
            status: "SUBMITTED",
            submittedAt: new Date("2026-08-15T12:00:10.000Z"),
            totalQuestions: 100,
            answeredQuestions: 92,
            unansweredQuestions: 8,
            startTime: new Date(),
            endTime: new Date(),
            ipAddress: req.body.ipAddress || "192.168.10.50",
            deviceId: req.body.deviceId || "DEVICE-001"
          }
        },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error("MOCK SUBMIT EXAM ERROR:", err);
  }

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam submitted successfully",
    data: {
      submissionId: "68b100112233445566778899",
      submissionStatus: "SUBMITTED",
      submittedAt: "2026-08-15T12:00:10.000Z",
      answeredQuestions: 92,
      unansweredQuestions: 8,
      resultStatus: "PENDING_EVALUATION"
    },
  });
});

/*
|--------------------------------------------------------------------------
| Auto Submit
|--------------------------------------------------------------------------
*/

export const autoSubmit = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.autoSubmit(
    req.params.id as string,
  );

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam auto-submitted successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Heartbeat
|--------------------------------------------------------------------------
*/

export const heartbeat = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.heartbeat(req.params.id as string);

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Heartbeat updated successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Remaining Time
|--------------------------------------------------------------------------
*/

export const updateRemainingTime = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examSubmissionService.updateRemainingTime(
      req.params.id as string,
      req.body.remainingTime,
    );

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Remaining time updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

export const getSubmissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examSubmissionService.getById(req.params.id as string);

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Submission retrieved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export const getSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await examSubmissionService.getAll(req.query);

    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Submissions retrieved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.dashboard(
    req.query.examId as string | undefined,
  );

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Dashboard retrieved successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const result = await examSubmissionService.statistics(
    req.query.examId as string | undefined,
  );

  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Statistics retrieved successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Update Submission (Mock)
|--------------------------------------------------------------------------
*/

export const updateSubmission = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam submission updated successfully",
    data: {
      submissionId: "68b100112233445566778899",
      submissionStatus: "SUBMITTED",
      securityReviewStatus: "APPROVED",
      updatedAt: "2026-08-15T12:30:00Z"
    }
  });
});

/*
|--------------------------------------------------------------------------
| Get Report (Mock)
|--------------------------------------------------------------------------
*/

export const getReport = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Exam submission report generated successfully",
    data: {
      reportName: "SSC_CGL_Submission_Report",
      summary: {
        totalCandidates: 500,
        submitted: 485,
        pending: 10,
        forceSubmitted: 3,
        autoTimeout: 2,
        manualSubmission: 480,
        averageSubmissionTime: 178,
        averageAnsweredQuestions: 91
      },
      downloadUrl: "https://storage.exam.com/reports/submission-report.pdf"
    }
  });
});
