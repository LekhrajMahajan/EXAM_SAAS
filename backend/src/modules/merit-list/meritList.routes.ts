import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createMeritList,
  generateMeritList,
  publishMeritList,
  unpublishMeritList,
  lockMeritList,
  unlockMeritList,
  regenerateMeritList,
  archiveMeritList,
  cancelMeritList,
  getMeritListById,
  getCandidateMeritList,
  getExamMeritList,
  getMeritLists,
  top10,
  top100,
  dashboard,
  statistics,
  softDeleteMeritList,
  restoreMeritList,
} from "./meritList.controller";

import {
  createMeritListSchema,
  meritListIdSchema,
  generateMeritListSchema,
  publishMeritListSchema,
  cancelMeritListSchema,
  restoreMeritListSchema,
  deleteMeritListSchema,
  meritListQuerySchema,
  dashboardSchema,
  statisticsSchema,
  candidateMeritSchema,
  examMeritSchema,
  topListSchema,
} from "./meritList.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(dashboardSchema),

  dashboard,
);

router.get(
  "/statistics",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(statisticsSchema),

  statistics,
);

/*
|--------------------------------------------------------------------------
| Top Rankers
|--------------------------------------------------------------------------
*/

router.get(
  "/top10",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.CANDIDATE,
  ),

  validate(topListSchema),

  top10,
);

router.get(
  "/top100",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(topListSchema),

  top100,
);

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

router.get(
  "/exam/:examId",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(examMeritSchema),

  getExamMeritList,
);

router.get(
  "/candidate/:candidateId",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.CANDIDATE,
  ),

  validate(candidateMeritSchema),

  getCandidateMeritList,
);

/*
|--------------------------------------------------------------------------
| Workflow
|--------------------------------------------------------------------------
*/

router.post(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(createMeritListSchema),

  createMeritList,
);

router.patch(
  "/:id/generate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(generateMeritListSchema),

  generateMeritList,
);

router.patch(
  "/:id/publish",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(publishMeritListSchema),

  publishMeritList,
);

router.patch(
  "/:id/cancel",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(cancelMeritListSchema),

  cancelMeritList,
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(meritListQuerySchema),

  getMeritLists,
);

router.get(
  "/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.CANDIDATE,
  ),

  validate(meritListIdSchema),

  getMeritListById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(deleteMeritListSchema),

  softDeleteMeritList,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(restoreMeritListSchema),

  restoreMeritList,
);

router.patch("/:id/unpublish", authenticate, unpublishMeritList);

router.patch("/:id/lock", authenticate, lockMeritList);

router.patch("/:id/unlock", authenticate, unlockMeritList);

router.patch("/:id/regenerate", authenticate, regenerateMeritList);

router.patch("/:id/archive", authenticate, archiveMeritList);

export default router;
