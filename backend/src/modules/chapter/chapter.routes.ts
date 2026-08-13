import { Router } from "express";

import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  updateChapterStatus,
  deleteChapter,
  restoreChapter,
  getChapterStatistics,
} from "./chapter.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createChapterSchema,
  updateChapterSchema,
  updateChapterStatusSchema,
} from "./chapter.validation";

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
  getChapterStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Chapter
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
  ),
  validate(createChapterSchema),
  createChapter,
);

/*
|--------------------------------------------------------------------------
| Get All Chapters
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
  getChapters,
);

/*
|--------------------------------------------------------------------------
| Get Chapter By Id
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
  getChapterById,
);

/*
|--------------------------------------------------------------------------
| Update Chapter
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
  ),
  validate(updateChapterSchema),
  updateChapter,
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
  validate(updateChapterStatusSchema),
  updateChapterStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Chapter
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreChapter,
);

/*
|--------------------------------------------------------------------------
| Delete Chapter
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteChapter,
);

export default router;
