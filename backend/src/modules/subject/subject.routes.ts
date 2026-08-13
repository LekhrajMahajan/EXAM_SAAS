import { Router } from "express";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  updateSubjectStatus,
  deleteSubject,
  restoreSubject,
  getSubjectStatistics,
} from "./subject.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { checkUsageLimit } from "../../middleware/checkUsageLimit";
import Subject from "./subject.model";

import { UserRole } from "../../constants/roles";

import {
  createSubjectSchema,
  updateSubjectSchema,
  updateSubjectStatusSchema,
} from "./subject.validation";

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
  getSubjectStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Subject
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
  ),
  validate(createSubjectSchema),
  checkUsageLimit('maxSubjects', Subject),
  createSubject,
);

/*
|--------------------------------------------------------------------------
| Get All Subjects
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
    UserRole.PAPER_SETTER,
    UserRole.QUESTION_SETTER,
  ),
  getSubjects,
);

/*
|--------------------------------------------------------------------------
| Get Subject By Id
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
    UserRole.PAPER_SETTER,
    UserRole.QUESTION_SETTER,
  ),
  getSubjectById,
);

/*
|--------------------------------------------------------------------------
| Update Subject
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
  ),
  validate(updateSubjectSchema),
  updateSubject,
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
  validate(updateSubjectStatusSchema),
  updateSubjectStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Subject
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreSubject,
);

/*
|--------------------------------------------------------------------------
| Delete Subject
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteSubject,
);

export default router;
