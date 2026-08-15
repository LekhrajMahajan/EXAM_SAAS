import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { candidateExamService } from "./candidateExam.service";
import { sendResponse } from "../../utils/response";
import HTTP_STATUS from "http-status";

/*
|--------------------------------------------------------------------------
| Candidate Exam Login
|--------------------------------------------------------------------------
*/

export const candidateExamLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.login(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate logged in to exam successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Face Verification
|--------------------------------------------------------------------------
*/

export const candidateExamFaceVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.faceVerification(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification successful.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Device Registration
|--------------------------------------------------------------------------
*/

export const candidateExamDeviceRegistration = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.deviceRegistration(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Device registered successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Geo Verification
|--------------------------------------------------------------------------
*/

export const candidateExamGeoVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.geoVerification(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Geo verification successful.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Start Exam
|--------------------------------------------------------------------------
*/

export const candidateExamStart = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.startExam(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate exam started successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Get Questions
|--------------------------------------------------------------------------
*/

export const candidateExamGetQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.getQuestions(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Questions fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Save Answer
|--------------------------------------------------------------------------
*/

export const candidateExamSaveAnswer = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.saveAnswer(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Answer saved successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Mark For Review
|--------------------------------------------------------------------------
*/

export const candidateExamMarkForReview = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.markForReview(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Question marked for review successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Clear Response
|--------------------------------------------------------------------------
*/

export const candidateExamClearResponse = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.clearResponse(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Response cleared successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Save & Next
|--------------------------------------------------------------------------
*/

export const candidateExamSaveNext = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.saveNext(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Answer saved and next question loaded successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Previous Question
|--------------------------------------------------------------------------
*/

export const candidateExamPreviousQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.previousQuestion(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Previous question fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Submit Exam
|--------------------------------------------------------------------------
*/

export const candidateExamSubmit = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.submitExam(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam submitted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Auto Submit Exam
|--------------------------------------------------------------------------
*/

export const candidateExamAutoSubmit = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.autoSubmitExam(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam auto submitted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Result Preview
|--------------------------------------------------------------------------
*/

export const candidateExamResultPreview = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.resultPreview(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Result preview fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Violation Logs
|--------------------------------------------------------------------------
*/

export const candidateExamViolationLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.violationLogs(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Violation logs fetched successfully.",
      data: result,
    });
  },
);
/*
|--------------------------------------------------------------------------
| Candidate Log Violation (POST)
|--------------------------------------------------------------------------
*/

export const candidateExamLogViolation = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.logViolation(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Violation logged successfully.",
      data: result,
    });
  },
);
/*
|--------------------------------------------------------------------------
| Candidate Session Heartbeat
|--------------------------------------------------------------------------
*/

export const candidateExamSessionHeartbeat = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.sessionHeartbeat(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Heartbeat received successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Reconnect Session
|--------------------------------------------------------------------------
*/

export const candidateExamReconnect = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.reconnectSession(req.body);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Session restored successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Exam Summary
|--------------------------------------------------------------------------
*/

export const candidateExamExamSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.examSummary(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam summary fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Candidate Final Result
|--------------------------------------------------------------------------
*/

export const candidateExamFinalResult = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await candidateExamService.finalResult(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Final result fetched successfully.",
      data: result,
    });
  },
);
