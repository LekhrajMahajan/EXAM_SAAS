import { Router } from "express";

import {
  createPaper,
  getPapers,
  getPaperById,
  getPaperPreview,
  updatePaper,
  clonePaper,
  updatePaperStatus,
  updatePaperApproval,
  submitPaperForApproval,
  approvePaper,
  rejectPaper,
  deletePaper,
  restorePaper,
  getPaperStatistics,
  addQuestionToPaper,
  updatePaperQuestion,
  removePaperQuestion,
  getAssignedPapers,
  addBulkQuestionsToPaper,
} from "./paper.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createPaperSchema,
  updatePaperSchema,
  clonePaperSchema,
  updatePaperStatusSchema,
  updatePaperApprovalSchema,
  submitPaperForApprovalSchema,
  approvePaperSchema,
  rejectPaperSchema,
} from "./paper.validation";

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
  getPaperStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Paper
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(createPaperSchema),
  createPaper,
);

/*
|--------------------------------------------------------------------------
| Get All Papers
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
  ),
  getPapers,
);

router.get(
  "/assigned",
  authenticate,
  authorize(UserRole.PAPER_SETTER),
  getAssignedPapers,
);

/*
|--------------------------------------------------------------------------
| Get Paper By Id
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
  getPaperById,
);

/*
|--------------------------------------------------------------------------
| Get Paper Preview
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/preview",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
  ),
  getPaperPreview,
);

/*
|--------------------------------------------------------------------------
| Update Paper
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(updatePaperSchema),
  updatePaper,
);

/*
|--------------------------------------------------------------------------
| Clone Paper
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/clone",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
  ),
  validate(clonePaperSchema),
  clonePaper,
);

/*
|--------------------------------------------------------------------------
| Update Paper Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
  ),
  validate(updatePaperStatusSchema),
  updatePaperStatus,
);

/*
|--------------------------------------------------------------------------
| Submit For Approval
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/submit-for-approval",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  validate(submitPaperForApprovalSchema),
  submitPaperForApproval,
);

/*
|--------------------------------------------------------------------------
| Approve Paper
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(approvePaperSchema),
  approvePaper,
);

/*
|--------------------------------------------------------------------------
| Reject Paper
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/reject",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(rejectPaperSchema),
  rejectPaper,
);

/*
|--------------------------------------------------------------------------
| Update Approval
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approval",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updatePaperApprovalSchema),
  updatePaperApproval,
);

/*
|--------------------------------------------------------------------------
| Paper Question Management (Phase 6)
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/questions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  addQuestionToPaper,
);

router.post(
  "/:id/questions/bulk",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  addBulkQuestionsToPaper,
);

router.patch(
  "/:id/questions/:questionId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  updatePaperQuestion,
);

router.delete(
  "/:id/questions/:questionId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.PAPER_SETTER,
  ),
  removePaperQuestion,
);

/*
|--------------------------------------------------------------------------
| Restore Paper
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restorePaper,
);

/*
|--------------------------------------------------------------------------
| Delete Paper
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deletePaper,
);

export default router;
