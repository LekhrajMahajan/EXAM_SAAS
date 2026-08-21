import { Router } from "express";

import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  updateExamStatus,
  updateExamApproval,
  restoreExam,
  getExamStatistics,
  cloneExam,
  getExamPreview,
  submitExamForApproval,
  approveExam,
  rejectExam,
  deleteExam,
  startExam,
  endExam,
  publishExamResult,
  autoSelectPaper,
} from "./exam.controller";

import { authenticate } from "../../middleware/authenticate";
import mongoose from "mongoose";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { checkUsageLimit } from "../../middleware/checkUsageLimit";
import Exam from "./exam.model";

import { UserRole } from "../../constants/roles";

import {
  createExamSchema,
  updateExamSchema,
  updateExamStatusSchema,
  updateExamApprovalSchema,
  cloneExamSchema,
  submitExamForApprovalSchema,
  approveExamSchema,
  rejectExamSchema,
  startExamSchema,
  endExamSchema,
  publishExamResultSchema,
} from "./exam.validation";

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
  getExamStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Exam
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(createExamSchema),
  checkUsageLimit('maxExams', Exam),
  createExam,
);

/*
|--------------------------------------------------------------------------
| Get All Exams
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.GOVT_AUTHORITY,
    UserRole.PRIVATE_AUTHORITY,
  ),
  getExams,
);

/*
|--------------------------------------------------------------------------
| Get Exam By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamById,
);

/*
|--------------------------------------------------------------------------
| Get Exam Preview
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/preview",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamPreview,
);

/*
|--------------------------------------------------------------------------
| Update Exam
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateExamSchema),
  updateExam,
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
  validate(updateExamStatusSchema),
  updateExamStatus,
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
    UserRole.EXAM_MANAGER,
  ),
  validate(submitExamForApprovalSchema),
  submitExamForApproval,
);

/*
|--------------------------------------------------------------------------
| Approve Exam
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(approveExamSchema),
  approveExam,
);

/*
|--------------------------------------------------------------------------
| Reject Exam
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/reject",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(rejectExamSchema),
  rejectExam,
);

/*
|--------------------------------------------------------------------------
| Start Exam
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/start",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(startExamSchema),
  startExam,
);

/*
|--------------------------------------------------------------------------
| End Exam
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/end",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(endExamSchema),
  endExam,
);

/*
|--------------------------------------------------------------------------
| Publish Exam Result
|--------------------------------------------------------------------------
*/

const publishExamResultMiddlewares = [
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(publishExamResultSchema),
  publishExamResult,
];

router.post("/:id/publish-result", ...publishExamResultMiddlewares);
router.get("/:id/publish-result", ...publishExamResultMiddlewares);
router.patch("/:id/publish-result", ...publishExamResultMiddlewares);

/*
|--------------------------------------------------------------------------
| Auto Select Paper
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/papers/auto-select",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  autoSelectPaper,
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
  ),
  validate(updateExamApprovalSchema),
  updateExamApproval,
);

/*
|--------------------------------------------------------------------------
| Restore Exam
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreExam,
);

/*
|--------------------------------------------------------------------------
| Delete Exam
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteExam,
);
/*
|--------------------------------------------------------------------------
| Clone Exam
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/clone",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(cloneExamSchema),
  cloneExam,
);

export default router;
