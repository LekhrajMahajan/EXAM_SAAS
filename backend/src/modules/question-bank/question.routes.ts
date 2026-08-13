import { Router } from "express";

import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  updateQuestionStatus,
  updateQuestionApproval,
  deleteQuestion,
  restoreQuestion,
  getQuestionStatistics,
  importQuestions,
  exportQuestions,
  previewQuestion,
  duplicateQuestion,
} from "./question.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createQuestionSchema,
  updateQuestionSchema,
  updateQuestionStatusSchema,
  updateApprovalSchema,
  questionIdSchema,
  duplicateQuestionSchema,
} from "./question.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getQuestionStatistics,
);

/*
|--------------------------------------------------------------------------
| Import Questions
|--------------------------------------------------------------------------
*/

router.post(
  "/import",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.QUESTION_SETTER,
  ),
  importQuestions,
);

/*
|--------------------------------------------------------------------------
| Export Questions
|--------------------------------------------------------------------------
*/

router.get(
  "/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.QUESTION_SETTER,
    UserRole.PAPER_SETTER,
  ),
  exportQuestions,
);

/*
|--------------------------------------------------------------------------
| Create Question
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.QUESTION_SETTER,
  ),
  validate(createQuestionSchema),
  createQuestion,
);

/*
|--------------------------------------------------------------------------
| Get All Questions
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.QUESTION_SETTER,
    UserRole.PAPER_SETTER,
  ),
  getQuestions,
);

/*
|--------------------------------------------------------------------------
| Get Question By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.QUESTION_SETTER,
    UserRole.PAPER_SETTER,
  ),
  validate(questionIdSchema),
  getQuestionById,
);

/*
|--------------------------------------------------------------------------
| Preview Question
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/preview",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.QUESTION_SETTER,
    UserRole.PAPER_SETTER,
  ),
  validate(questionIdSchema),
  previewQuestion,
);

/*
|--------------------------------------------------------------------------
| Duplicate Question
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/duplicate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.QUESTION_SETTER,
  ),
  validate(duplicateQuestionSchema),
  duplicateQuestion,
);

/*
|--------------------------------------------------------------------------
| Update Question
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.QUESTION_SETTER,
  ),
  validate(updateQuestionSchema),
  updateQuestion,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
  ),
  validate(updateQuestionStatusSchema),
  updateQuestionStatus,
);

/*
|--------------------------------------------------------------------------
| Approval
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approval",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateApprovalSchema),
  updateQuestionApproval,
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(questionIdSchema),
  restoreQuestion,
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(questionIdSchema),
  deleteQuestion,
);

export default router;
