import { Router } from "express";
import { candidateExamLogin, candidateExamFaceVerification, candidateExamDeviceRegistration, candidateExamGeoVerification, candidateExamStart, candidateExamGetQuestions, candidateExamSaveAnswer, candidateExamMarkForReview, candidateExamClearResponse, candidateExamSaveNext, candidateExamPreviousQuestion, candidateExamSubmit, candidateExamAutoSubmit, candidateExamResultPreview, candidateExamViolationLogs, candidateExamSessionHeartbeat, candidateExamReconnect, candidateExamExamSummary, candidateExamFinalResult } from "./candidateExam.controller";
import { validate } from "../../middleware/validate";
import { candidateExamLoginSchema, faceVerificationSchema, deviceRegistrationSchema, geoVerificationSchema, startExamSchema, getQuestionsSchema, saveAnswerSchema, markForReviewSchema, clearResponseSchema, saveNextSchema, previousQuestionSchema, submitExamSchema, autoSubmitExamSchema, resultPreviewSchema, violationLogsSchema, sessionHeartbeatSchema, reconnectSchema, examSummarySchema, finalResultSchema } from "./candidateExam.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Candidate Exam Login
|--------------------------------------------------------------------------
*/

router.post("/login", validate(candidateExamLoginSchema), candidateExamLogin);

/*
|--------------------------------------------------------------------------
| Candidate Face Verification
|--------------------------------------------------------------------------
*/

router.post("/face-verification", validate(faceVerificationSchema), candidateExamFaceVerification);

/*
|--------------------------------------------------------------------------
| Candidate Device Registration
|--------------------------------------------------------------------------
*/

router.post("/device-registration", validate(deviceRegistrationSchema), candidateExamDeviceRegistration);

/*
|--------------------------------------------------------------------------
| Candidate Geo Verification
|--------------------------------------------------------------------------
*/

router.post("/geo-verification", validate(geoVerificationSchema), candidateExamGeoVerification);

/*
|--------------------------------------------------------------------------
| Candidate Start Exam
|--------------------------------------------------------------------------
*/

router.post("/start", validate(startExamSchema), candidateExamStart);

/*
|--------------------------------------------------------------------------
| Candidate Get Questions
|--------------------------------------------------------------------------
*/

router.get("/questions", validate(getQuestionsSchema), candidateExamGetQuestions);

/*
|--------------------------------------------------------------------------
| Candidate Save Answer
|--------------------------------------------------------------------------
*/

router.post("/save-answer", validate(saveAnswerSchema), candidateExamSaveAnswer);

/*
|--------------------------------------------------------------------------
| Candidate Mark For Review
|--------------------------------------------------------------------------
*/

router.patch("/mark-for-review", validate(markForReviewSchema), candidateExamMarkForReview);

/*
|--------------------------------------------------------------------------
| Candidate Clear Response
|--------------------------------------------------------------------------
*/

router.patch("/clear-response", validate(clearResponseSchema), candidateExamClearResponse);

/*
|--------------------------------------------------------------------------
| Candidate Save & Next
|--------------------------------------------------------------------------
*/

router.post("/save-next", validate(saveNextSchema), candidateExamSaveNext);

/*
|--------------------------------------------------------------------------
| Candidate Previous Question
|--------------------------------------------------------------------------
*/

router.get("/previous-question", validate(previousQuestionSchema), candidateExamPreviousQuestion);

/*
|--------------------------------------------------------------------------
| Candidate Submit Exam
|--------------------------------------------------------------------------
*/

router.post("/submit", validate(submitExamSchema), candidateExamSubmit);

/*
|--------------------------------------------------------------------------
| Candidate Auto Submit Exam
|--------------------------------------------------------------------------
*/

router.post("/auto-submit", validate(autoSubmitExamSchema), candidateExamAutoSubmit);

/*
|--------------------------------------------------------------------------
| Candidate Result Preview
|--------------------------------------------------------------------------
*/

router.get("/result-preview", validate(resultPreviewSchema), candidateExamResultPreview);

/*
|--------------------------------------------------------------------------
| Candidate Violation Logs
|--------------------------------------------------------------------------
*/

router.get("/violation-logs", validate(violationLogsSchema), candidateExamViolationLogs);

/*
|--------------------------------------------------------------------------
| Candidate Session Heartbeat
|--------------------------------------------------------------------------
*/

router.post("/session-heartbeat", validate(sessionHeartbeatSchema), candidateExamSessionHeartbeat);

/*
|--------------------------------------------------------------------------
| Candidate Reconnect Session
|--------------------------------------------------------------------------
*/

router.post("/reconnect", validate(reconnectSchema), candidateExamReconnect);

/*
|--------------------------------------------------------------------------
| Candidate Exam Summary
|--------------------------------------------------------------------------
*/

router.get("/exam-summary", validate(examSummarySchema), candidateExamExamSummary);

/*
|--------------------------------------------------------------------------
| Candidate Final Result
|--------------------------------------------------------------------------
*/

router.get("/final-result", validate(finalResultSchema), candidateExamFinalResult);

export default router;
