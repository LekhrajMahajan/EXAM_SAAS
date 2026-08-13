import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createCandidateAnswer,
  saveAnswer,
  updateAnswer,
  markForReview,
  clearAnswer,
  getCandidateAnswerById,
  getAnswerByQuestion,
  fetchSubmissionByQuery,
  submitExam,
  getSubmissionAnswers,
  getCandidateAnswers,
  dashboard,
  statistics,
  submissionProgress,
} from "./candidateAnswer.controller";

import {
  saveAnswerSchema,
  updateAnswerSchema,
  markForReviewSchema,
  clearAnswerSchema,
  candidateAnswerIdSchema,
  submissionAnswersSchema,
  candidateAnswerQuerySchema,
} from "./candidateAnswer.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Candidate APIs
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  validate(saveAnswerSchema),
  createCandidateAnswer,
);

router.post(
  "/save",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(saveAnswerSchema),
  saveAnswer,
);

router.post(
  "/submit",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  submitExam,
);

router.patch(
  "/:id",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  validate(updateAnswerSchema),
  updateAnswer,
);

// Alias to support POST for updates since the user is sending a POST request
router.post(
  "/:id",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  validate(updateAnswerSchema),
  updateAnswer,
);

router.patch(
  "/:id/review",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  validate(markForReviewSchema),
  markForReview,
);

// Alias for GET requests for easy testing
router.get(
  "/:id/mark-review",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  markForReview,
);

router.patch(
  "/:id/clear",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER
  ),
  validate(clearAnswerSchema),
  clearAnswer,
);

/*
|--------------------------------------------------------------------------
| Common APIs
|--------------------------------------------------------------------------
*/

router.get(
  "/question/:questionId",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  getAnswerByQuestion,
);

router.get(
  "/submission",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  fetchSubmissionByQuery,
);

router.get(
  "/:id",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validate(candidateAnswerIdSchema),
  getCandidateAnswerById,
);

router.get(
  "/submission/:submissionId",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validate(submissionAnswersSchema),
  getSubmissionAnswers,
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
  validate(candidateAnswerQuerySchema),
  getCandidateAnswers,
);

router.get(
  "/dashboard/:submissionId",
  authenticate,
  authorize(
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  dashboard,
);

router.get(
  "/statistics/:submissionId",
  authenticate,
  authorize(
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  statistics,
);

router.get(
  "/progress/:submissionId",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  submissionProgress,
);

export default router;
