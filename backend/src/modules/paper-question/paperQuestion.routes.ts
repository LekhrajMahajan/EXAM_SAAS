import { Router } from "express";

import {
  createPaperQuestion,
  bulkCreatePaperQuestion,
  getPaperQuestions,
  getPaperQuestionById,
  updatePaperQuestion,
  reorderPaperQuestions,
  updatePaperQuestionStatus,
  deletePaperQuestion,
  restorePaperQuestion,
  getPaperQuestionStatistics,
  mapPaperQuestions,
} from "./paperQuestion.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createPaperQuestionSchema,
  bulkCreatePaperQuestionSchema,
  updatePaperQuestionSchema,
  reorderPaperQuestionsSchema,
  updatePaperQuestionStatusSchema,
  mapPaperQuestionsSchema,
} from "./paperQuestion.validation";

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
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getPaperQuestionStatistics,
);

/*
|--------------------------------------------------------------------------
| Add Question
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(createPaperQuestionSchema),
  createPaperQuestion,
);

/*
|--------------------------------------------------------------------------
| Bulk Add Questions
|--------------------------------------------------------------------------
*/

router.post(
  "/bulk",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(bulkCreatePaperQuestionSchema),
  bulkCreatePaperQuestion,
);

/*
|--------------------------------------------------------------------------
| Map Paper Questions
|--------------------------------------------------------------------------
*/

router.post(
  "/map",
  validate(mapPaperQuestionsSchema),
  mapPaperQuestions,
);

/*
|--------------------------------------------------------------------------
| Get Questions By Paper
|--------------------------------------------------------------------------
*/

router.get(
  "/paper/:paperId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
  ),
  getPaperQuestions,
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
  ),
  getPaperQuestionById,
);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(updatePaperQuestionSchema),
  updatePaperQuestion,
);

/*
|--------------------------------------------------------------------------
| Reorder Questions
|--------------------------------------------------------------------------
*/

router.patch(
  "/reorder",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(reorderPaperQuestionsSchema),
  reorderPaperQuestions,
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
  validate(updatePaperQuestionStatusSchema),
  updatePaperQuestionStatus,
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
  restorePaperQuestion,
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
  deletePaperQuestion,
);

export default router;
