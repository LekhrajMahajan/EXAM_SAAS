import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createSubmission,
  startExam,
  resumeExam,
  pauseExam,
  submitExam,
  submitExamByPost,
  autoSubmit,
  heartbeat,
  updateRemainingTime,
  getSubmissionById,
  getSubmissions,
  dashboard,
  statistics,
  updateSubmission,
  getReport,
} from "./examSubmission.controller";

import {
  startExamSchema,
  resumeExamSchema,
  pauseExamSchema,
  submitExamSchema,
  autoSubmitSchema,
  heartbeatSchema,
  updateRemainingTimeSchema,
  submissionIdSchema,
  submissionQuerySchema,
  dashboardSchema,
  statisticsSchema,
} from "./examSubmission.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Candidate APIs
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(startExamSchema),
  createSubmission,
);

router.patch(
  "/:id/start",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(resumeExamSchema),
  startExam,
);

router.patch(
  "/:id/resume",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(resumeExamSchema),
  resumeExam,
);

router.patch(
  "/:id/pause",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(pauseExamSchema),
  pauseExam,
);

router.patch(
  "/:id/heartbeat",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(heartbeatSchema),
  heartbeat,
);

router.patch(
  "/:id/time",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(updateRemainingTimeSchema),
  updateRemainingTime,
);

router.patch(
  "/:id/submit",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(submitExamSchema),
  submitExam,
);

router.post(
  "/submit",
  submitExamByPost,
);

router.patch(
  "/:id/auto-submit",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.TECHNICAL_MANAGER,
  ),
  validate(autoSubmitSchema),
  autoSubmit,
);

/*
|--------------------------------------------------------------------------
| Common APIs
|--------------------------------------------------------------------------
*/

router.get("/report", getReport);

router.get(
  "/:id",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validate(submissionIdSchema),
  getSubmissionById,
);

/*
|--------------------------------------------------------------------------
| Admin APIs
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validate(submissionQuerySchema),
  getSubmissions,
);

router.get(
  "/dashboard",
  authenticate,
  authorize(
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validate(dashboardSchema),
  dashboard,
);

router.get(
  "/statistics",
  authenticate,
  authorize(
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validate(statisticsSchema),
  statistics,
);

/*
|--------------------------------------------------------------------------
| Update Submission By Id
|--------------------------------------------------------------------------
*/

router.patch("/:id", updateSubmission);

export default router;
