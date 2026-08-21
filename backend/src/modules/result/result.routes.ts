import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createResult,
  evaluateResult,
  publishResult,
  approveResult,
  rejectResult,
  reEvaluateResult,
  getResultById,
  getResultDetails,
  getCandidateResults,
  getExamResults,
  getResults,
  generateResults,
  bulkPublishResults,
  bulkApproveResults,
  dashboard,
  statistics,
  meritList,
  topper,
  passPercentage,
  softDeleteResult,
  restoreResult,
  exportExamResults,
} from "./result.controller";

import {
  createResultSchema,
  resultIdSchema,
  publishResultSchema,
  approveResultSchema,
  rejectResultSchema,
  restoreResultSchema,
  deleteResultSchema,
  candidateResultSchema,
  examResultSchema,
  resultQuerySchema,
  dashboardSchema,
  generateResultSchema,
  bulkPublishResultSchema,
  statisticsSchema,
  meritListSchema,
  topperSchema,
  passPercentageSchema,
} from "./result.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Candidate
|--------------------------------------------------------------------------
*/

router.get(
  "/candidate/:candidateId",

  authenticate,

  authorize(
    UserRole.CANDIDATE,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(candidateResultSchema),

  getCandidateResults,
);

/*
|--------------------------------------------------------------------------
| Exam
|--------------------------------------------------------------------------
*/

router.get(
  "/exam/:examId",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(examResultSchema),

  getExamResults,
);

router.get(
  "/export/:examId",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  exportExamResults,
);

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(dashboardSchema),

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

  validateRequest(statisticsSchema),

  statistics,
);

router.get(
  "/merit-list",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(meritListSchema),

  meritList,
);

router.get(
  "/topper/:examId",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(topperSchema),

  topper,
);

router.get(
  "/pass-percentage/:examId",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(passPercentageSchema),

  passPercentage,
);

/*
|--------------------------------------------------------------------------
| Result Workflow
|--------------------------------------------------------------------------
*/

router.post(
  "/",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(createResultSchema),

  createResult,
);

/*
|--------------------------------------------------------------------------
| Generate Results
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",

  authenticate,

  authorize(
    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(generateResultSchema),

  generateResults,
);

/*
|--------------------------------------------------------------------------
| Bulk Publish Results
|--------------------------------------------------------------------------
*/

router.post(
  "/publish",

  authenticate,

  authorize(
    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(bulkPublishResultSchema),

  bulkPublishResults,
);

/*
|--------------------------------------------------------------------------
| Bulk Approve Results
|--------------------------------------------------------------------------
*/

router.get(
  "/approve",

  authenticate,

  authorize(
    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  bulkApproveResults,
);

router.post(
  "/approve",

  authenticate,

  authorize(
    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  bulkApproveResults,
);

router.patch(
  "/:id/evaluate",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(resultIdSchema),

  evaluateResult,
);

router.patch(
  "/:id/re-evaluate",

  authenticate,

  authorize(
    UserRole.EXAM_MANAGER,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(resultIdSchema),

  reEvaluateResult,
);

router.patch(
  "/:id/publish",

  authenticate,

  authorize(
    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(publishResultSchema),

  publishResult,
);

router.patch(
  "/:id/approve",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(approveResultSchema),

  approveResult,
);

router.patch(
  "/:id/reject",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(rejectResultSchema),

  rejectResult,
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
    UserRole.EXAM_MANAGER,

    UserRole.COMPANY_ADMIN,

    UserRole.MASTER_ADMIN,
  ),

  validateRequest(resultQuerySchema),

  getResults,
);

router.get(
  "/:id/details",
  authenticate,
  authorize(
    UserRole.CANDIDATE,
    UserRole.EXAM_MANAGER,
    UserRole.COMPANY_ADMIN,
    UserRole.MASTER_ADMIN,
  ),
  validateRequest(resultIdSchema),
  getResultDetails,
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

  validateRequest(resultIdSchema),

  getResultById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(deleteResultSchema),

  softDeleteResult,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(restoreResultSchema),

  restoreResult,
);

export default router;
